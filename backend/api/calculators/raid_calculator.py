"""
RAID Calculator (Array Capacity, Redundancy, Rebuild Time & URE Risk).

Calculates usable storage capacity, fault tolerance, parity overhead,
storage efficiency, read/write throughput multipliers, IOPS write penalties,
rebuild times, and scientific Unrecoverable Read Error (URE) probabilities
across Synology Hybrid RAID (SHR-1, SHR-2), standard (RAID 0, 1, 5, 6, 10),
enterprise (RAID 50, 60), JBOD, and OpenZFS (RAID-Z1, RAID-Z2, RAID-Z3) configurations.
Supports both uniform drive sets and heterogeneous mixed-capacity drive arrays.
"""
import math
from typing import List, Dict, Any
from .engine import CalcField, register_calculator


URE_RATES = {
    "consumer_hdd": 1e-14,    # 1 in 10^14 bits (~12.5 TB)
    "enterprise_hdd": 1e-15,  # 1 in 10^15 bits (~125 TB)
    "sata_ssd": 1e-16,        # 1 in 10^16 bits
    "nvme_ssd": 1e-17,        # 1 in 10^17 bits
}

FILESYSTEM_OVERHEADS = {
    "btrfs": 0.04,     # 4% metadata & B-tree reservation (Synology DSM default)
    "zfs": 0.0156,     # 1/64 slop space (TrueNAS / Proxmox)
    "ext4": 0.02,      # 2% reserved root blocks & inodes (Linux standard)
    "ntfs": 0.015,     # 1.5% MFT reservation (Windows Server)
    "raw": 0.0,        # 0% raw unformatted partition
}

MIN_DRIVES = {
    "shr1": 1,
    "shr2": 4,
    "raid0": 2,
    "raid1": 2,
    "raid5": 3,
    "raid6": 4,
    "raid10": 4,
    "raid50": 6,
    "raid60": 8,
    "jbod": 1,
    "zfs_z1": 3,
    "zfs_z2": 4,
    "zfs_z3": 5,
}


def _calc_mixed_shr1(drives: List[float]) -> Dict[str, float]:
    """Calculate SHR-1 dynamic horizontal slicing for mixed drives."""
    sorted_d = sorted([d for d in drives if d > 0], reverse=True)
    n = len(sorted_d)
    if n == 0:
        return {"usable": 0.0, "protection": 0.0, "unused": 0.0, "total": 0.0}
    if n == 1:
        return {"usable": sorted_d[0], "protection": 0.0, "unused": 0.0, "total": sorted_d[0]}

    unique_heights = sorted(list(set(sorted_d)))
    prev_h = 0.0
    usable = 0.0
    protection = 0.0
    unused = 0.0

    for h in unique_heights:
        slice_h = h - prev_h
        count = sum(1 for d in sorted_d if d >= h)
        if count >= 3:
            # RAID 5 slice
            usable += (count - 1) * slice_h
            protection += 1.0 * slice_h
        elif count == 2:
            # RAID 1 mirror slice
            usable += 1.0 * slice_h
            protection += 1.0 * slice_h
        elif count == 1:
            unused += 1.0 * slice_h
        prev_h = h

    return {
        "usable": round(usable, 2),
        "protection": round(protection, 2),
        "unused": round(unused, 2),
        "total": round(sum(sorted_d), 2),
    }


def _calc_mixed_shr2(drives: List[float]) -> Dict[str, float]:
    """Calculate SHR-2 dynamic horizontal slicing (2-drive fault tolerance)."""
    sorted_d = sorted([d for d in drives if d > 0], reverse=True)
    n = len(sorted_d)
    if n < 4:
        return {"usable": 0.0, "protection": 0.0, "unused": sum(sorted_d), "total": sum(sorted_d)}

    unique_heights = sorted(list(set(sorted_d)))
    prev_h = 0.0
    usable = 0.0
    protection = 0.0
    unused = 0.0

    for h in unique_heights:
        slice_h = h - prev_h
        count = sum(1 for d in sorted_d if d >= h)
        if count >= 4:
            # RAID 6 slice
            usable += (count - 2) * slice_h
            protection += 2.0 * slice_h
        elif count == 3:
            # 3-way mirror slice
            usable += 1.0 * slice_h
            protection += 2.0 * slice_h
        else:
            unused += count * slice_h
        prev_h = h

    return {
        "usable": round(usable, 2),
        "protection": round(protection, 2),
        "unused": round(unused, 2),
        "total": round(sum(sorted_d), 2),
    }


def _calculate_array_metrics(
    raid_type: str,
    drives: List[float],
    hot_spares: int = 0,
    disk_speed_mb: float = 220.0,
    ure_rate: float = 1e-15,
    filesystem: str = "btrfs",
) -> Dict[str, Any]:
    """Calculate complete array metrics for a given RAID level and list of drive capacities."""
    n_total = len(drives)
    if n_total == 0:
        return {"valid": False, "error": "No drives provided"}

    n_active = max(1, n_total - hot_spares)
    active_drives = sorted(drives[:n_active], reverse=True)
    spare_drives = drives[n_active:]
    total_raw_tb = sum(drives)
    spare_tb = sum(spare_drives)
    min_d = MIN_DRIVES.get(raid_type, 2)

    if n_active < min_d:
        return {
            "valid": False,
            "min_drives": min_d,
            "current_active": n_active,
            "error": f"Requires minimum {min_d} active drives (current active: {n_active})",
            "usable_tb": 0.0,
            "parity_tb": 0.0,
            "unused_tb": total_raw_tb,
            "efficiency_pct": 0.0,
            "fault_tolerance_drives": 0,
        }

    min_drive_size = min(active_drives) if active_drives else 0.0
    usable_tb = 0.0
    parity_tb = 0.0
    mirror_tb = 0.0
    unused_tb = 0.0
    fault_tolerance_drives = 0
    read_mult = 1.0
    write_mult = 1.0
    write_penalty = 1
    read_needs_drives = 1

    if raid_type == "shr1":
        shr_res = _calc_mixed_shr1(active_drives)
        usable_tb = shr_res["usable"]
        parity_tb = shr_res["protection"]
        unused_tb = shr_res["unused"]
        fault_tolerance_drives = 1
        read_mult = max(1.0, float(n_active - 1))
        write_mult = max(0.5, float(n_active) / 4.0)
        write_penalty = 4
        read_needs_drives = n_active - 1

    elif raid_type == "shr2":
        shr_res = _calc_mixed_shr2(active_drives)
        usable_tb = shr_res["usable"]
        parity_tb = shr_res["protection"]
        unused_tb = shr_res["unused"]
        fault_tolerance_drives = 2
        read_mult = max(1.0, float(n_active - 2))
        write_mult = max(0.4, float(n_active) / 6.0)
        write_penalty = 6
        read_needs_drives = n_active - 1

    elif raid_type == "raid0":
        # Standard striped RAID 0: bounded by smallest drive in hardware, or linear
        usable_tb = n_active * min_drive_size
        unused_tb = sum(active_drives) - usable_tb
        fault_tolerance_drives = 0
        read_mult = float(n_active)
        write_mult = float(n_active)
        write_penalty = 1
        read_needs_drives = n_active

    elif raid_type == "raid1":
        usable_tb = min_drive_size
        mirror_tb = (n_active - 1) * min_drive_size
        unused_tb = sum(active_drives) - (usable_tb + mirror_tb)
        fault_tolerance_drives = n_active - 1
        read_mult = float(n_active)
        write_mult = 1.0
        write_penalty = 1
        read_needs_drives = 1

    elif raid_type in ("raid5", "zfs_z1"):
        usable_tb = (n_active - 1) * min_drive_size
        parity_tb = min_drive_size
        unused_tb = sum(active_drives) - (usable_tb + parity_tb)
        fault_tolerance_drives = 1
        read_mult = max(1.0, float(n_active - 1))
        write_mult = max(0.5, float(n_active) / 4.0)
        write_penalty = 4
        read_needs_drives = n_active - 1

    elif raid_type in ("raid6", "zfs_z2"):
        usable_tb = (n_active - 2) * min_drive_size
        parity_tb = 2.0 * min_drive_size
        unused_tb = sum(active_drives) - (usable_tb + parity_tb)
        fault_tolerance_drives = 2
        read_mult = max(1.0, float(n_active - 2))
        write_mult = max(0.4, float(n_active) / 6.0)
        write_penalty = 6
        read_needs_drives = n_active - 1

    elif raid_type == "zfs_z3":
        usable_tb = (n_active - 3) * min_drive_size
        parity_tb = 3.0 * min_drive_size
        unused_tb = sum(active_drives) - (usable_tb + parity_tb)
        fault_tolerance_drives = 3
        read_mult = max(1.0, float(n_active - 3))
        write_mult = max(0.3, float(n_active) / 8.0)
        write_penalty = 8
        read_needs_drives = n_active - 1

    elif raid_type == "raid10":
        effective_n = n_active if n_active % 2 == 0 else n_active - 1
        if effective_n < 4:
            return {"valid": False, "min_drives": 4, "error": "RAID 10 requires at least 4 drives in even pairs"}
        pair_count = effective_n // 2
        usable_tb = pair_count * min_drive_size
        mirror_tb = pair_count * min_drive_size
        unused_tb = sum(active_drives) - (usable_tb + mirror_tb)
        fault_tolerance_drives = 1  # 1 guaranteed, up to n/2
        read_mult = float(effective_n)
        write_mult = float(pair_count)
        write_penalty = 2
        read_needs_drives = 1

    elif raid_type == "raid50":
        groups = 2
        usable_tb = (n_active - groups) * min_drive_size
        parity_tb = groups * min_drive_size
        unused_tb = sum(active_drives) - (usable_tb + parity_tb)
        fault_tolerance_drives = 1
        read_mult = max(1.0, float(n_active - groups))
        write_mult = max(0.5, float(n_active) / 4.0)
        write_penalty = 4
        read_needs_drives = n_active - groups

    elif raid_type == "raid60":
        groups = 2
        usable_tb = (n_active - (groups * 2)) * min_drive_size
        parity_tb = (groups * 2) * min_drive_size
        unused_tb = sum(active_drives) - (usable_tb + parity_tb)
        fault_tolerance_drives = 2
        read_mult = max(1.0, float(n_active - (groups * 2)))
        write_mult = max(0.4, float(n_active) / 6.0)
        write_penalty = 6
        read_needs_drives = n_active - (groups * 2)

    elif raid_type == "jbod":
        usable_tb = sum(active_drives)
        unused_tb = 0.0
        fault_tolerance_drives = 0
        read_mult = 1.0
        write_mult = 1.0
        write_penalty = 1
        read_needs_drives = 1

    efficiency_pct = (usable_tb / total_raw_tb * 100.0) if total_raw_tb > 0 else 0.0

    # Binary conversion
    tib_factor = 1000.0**4 / (1024.0**4)  # ~0.9094947
    usable_tib = usable_tb * tib_factor

    # Filesystem overhead
    fs_overhead_pct = FILESYSTEM_OVERHEADS.get(filesystem.lower(), 0.04)
    fs_reserved_tb = usable_tb * fs_overhead_pct
    fs_reserved_tib = usable_tib * fs_overhead_pct
    net_usable_tb = max(0.0, usable_tb - fs_reserved_tb)
    net_usable_tib = max(0.0, usable_tib - fs_reserved_tib)

    # URE Probability during array rebuild
    bits_read_during_rebuild = max(0, read_needs_drives) * min_drive_size * 8.0 * 1e12
    exponent = -bits_read_during_rebuild * ure_rate
    if exponent < -50:
        ure_prob_pct = 99.99
    else:
        ure_prob_pct = (1.0 - math.exp(exponent)) * 100.0
    ure_prob_pct = min(99.99, max(0.01, ure_prob_pct))

    est_read_speed_mb = round(disk_speed_mb * read_mult, 1)
    est_write_speed_mb = round(disk_speed_mb * write_mult, 1)

    rebuild_speed_mb = max(40.0, disk_speed_mb * 0.65)
    disk_mb = min_drive_size * 1000.0 * 1000.0
    rebuild_time_hours = round(disk_mb / (rebuild_speed_mb * 3600.0), 1) if min_drive_size > 0 else 0.0

    return {
        "valid": True,
        "usable_tb": round(usable_tb, 2),
        "usable_tib": round(usable_tib, 2),
        "net_usable_tb": round(net_usable_tb, 2),
        "net_usable_tib": round(net_usable_tib, 2),
        "fs_reserved_tb": round(fs_reserved_tb, 2),
        "fs_reserved_tib": round(fs_reserved_tib, 2),
        "parity_tb": round(parity_tb + mirror_tb, 2),
        "spare_tb": round(spare_tb, 2),
        "unused_tb": round(unused_tb, 2),
        "total_raw_tb": round(total_raw_tb, 2),
        "efficiency_pct": round(efficiency_pct, 1),
        "fault_tolerance_drives": fault_tolerance_drives,
        "read_multiplier": round(read_mult, 2),
        "write_multiplier": round(write_mult, 2),
        "write_penalty": write_penalty,
        "est_read_speed_mb": est_read_speed_mb,
        "est_write_speed_mb": est_write_speed_mb,
        "rebuild_time_hours": rebuild_time_hours,
        "ure_prob_pct": round(ure_prob_pct, 2),
    }


def _raid_calculator(values: dict) -> dict:
    """Execute RAID calculations with user parameters."""
    raid_type = str(values.get("raid_type", "raid5")).strip().lower()
    disk_count = int(max(1, min(64, values.get("disk_count", 4))))
    disk_size = float(max(0.1, values.get("disk_size", 8)))
    disk_unit = str(values.get("disk_unit", "TB")).strip().upper()
    hot_spares = int(max(0, min(disk_count - 1, values.get("hot_spares", 0))))
    disk_type = str(values.get("disk_type", "enterprise_hdd")).strip().lower()
    disk_speed_mb = float(max(10, values.get("disk_speed_mb", 220)))
    cost_per_disk = float(max(0, values.get("cost_per_disk", 180)))
    filesystem = str(values.get("filesystem", "btrfs")).strip().lower()

    # Mixed drives support
    drives_input = values.get("drives_list")
    if drives_input and isinstance(drives_input, list) and len(drives_input) > 0:
        drives = [float(x) for x in drives_input]
    elif drives_input and isinstance(drives_input, str) and "," in drives_input:
        drives = [float(x.strip()) for x in drives_input.split(",") if x.strip()]
    else:
        # Uniform drives
        if disk_unit == "GB":
            d_size = disk_size / 1000.0
        elif disk_unit == "PB":
            d_size = disk_size * 1000.0
        else:
            d_size = disk_size
        drives = [d_size] * disk_count

    ure_rate = URE_RATES.get(disk_type, 1e-15)

    result = _calculate_array_metrics(
        raid_type=raid_type,
        drives=drives,
        hot_spares=hot_spares,
        disk_speed_mb=disk_speed_mb,
        ure_rate=ure_rate,
        filesystem=filesystem,
    )

    if not result.get("valid", False):
        return {
            "error": result.get("error", "Invalid RAID configuration"),
            "valid": False,
            "min_drives": result.get("min_drives", 2),
            "current_drives": len(drives),
        }

    total_cost = round(len(drives) * cost_per_disk, 2)
    cost_per_usable_tb = round((total_cost / result["usable_tb"]), 2) if result["usable_tb"] > 0 else 0.0

    # Build comparison across all compatible RAID architectures
    comparison_levels = [
        ("shr1", "Synology SHR-1 (1-Drive Protection)"),
        ("shr2", "Synology SHR-2 (2-Drive Protection)"),
        ("raid0", "RAID 0 (Pure Stripe)"),
        ("raid1", "RAID 1 (Mirror)"),
        ("raid5", "RAID 5 (Single Parity)"),
        ("raid6", "RAID 6 (Dual Parity)"),
        ("raid10", "RAID 10 (Striped Mirrors)"),
        ("zfs_z1", "ZFS RAID-Z1 (Single Parity)"),
        ("zfs_z2", "ZFS RAID-Z2 (Dual Parity)"),
        ("zfs_z3", "ZFS RAID-Z3 (Triple Parity)"),
        ("jbod", "JBOD (Span / Concatenation)"),
    ]

    comparison = []
    for r_code, r_name in comparison_levels:
        comp_res = _calculate_array_metrics(
            raid_type=r_code,
            drives=drives,
            hot_spares=hot_spares,
            disk_speed_mb=disk_speed_mb,
            ure_rate=ure_rate,
            filesystem=filesystem,
        )
        if comp_res.get("valid", False):
            comparison.append({
                "raid_type": r_code,
                "name": r_name,
                "usable_tb": comp_res["usable_tb"],
                "usable_tib": comp_res["usable_tib"],
                "net_usable_tb": comp_res["net_usable_tb"],
                "parity_tb": comp_res["parity_tb"],
                "spare_tb": comp_res["spare_tb"],
                "unused_tb": comp_res["unused_tb"],
                "efficiency_pct": comp_res["efficiency_pct"],
                "fault_tolerance_drives": comp_res["fault_tolerance_drives"],
                "est_read_speed_mb": comp_res["est_read_speed_mb"],
                "est_write_speed_mb": comp_res["est_write_speed_mb"],
                "write_penalty": comp_res["write_penalty"],
            })

    # Recommended NAS enclosure bay size
    bay_count = len(drives)
    if bay_count <= 2:
        recommended_chassis = "2-Bay Desktop NAS (e.g. Synology DS224+ / QNAP TS-264)"
        recommended_nic = "1 GbE / 2.5 GbE Ethernet"
    elif bay_count <= 4:
        recommended_chassis = "4-Bay Tower NAS (e.g. Synology DS923+ / QNAP TS-464)"
        recommended_nic = "2.5 GbE / 10 GbE SFP+ / PCIe"
    elif bay_count <= 6:
        recommended_chassis = "6-Bay Workstation / NAS (e.g. Synology DS1621+)"
        recommended_nic = "10 GbE RJ45 / SFP+ Dual Port"
    elif bay_count <= 8:
        recommended_chassis = "8-Bay Tower / 2U Rackmount (e.g. Synology DS1821+ / RS1221+)"
        recommended_nic = "10 GbE / 25 GbE Dual SFP28"
    else:
        recommended_chassis = f"{bay_count}-Bay Enterprise 2U/3U/4U Rackmount Server"
        recommended_nic = "25 GbE / 40 GbE / 100 GbE NVMe-oF RoCE"

    return {
        **result,
        "disk_count": len(drives),
        "drives_list": drives,
        "total_cost": total_cost,
        "cost_per_usable_tb": cost_per_usable_tb,
        "recommended_chassis": recommended_chassis,
        "recommended_nic": recommended_nic,
        "comparison": comparison,
    }


register_calculator(
    id="raid-calculator",
    name="RAID Storage Calculator",
    description="Calculate usable capacity, parity protection, rebuild times, and failure resilience for Synology SHR, RAID 0/1/5/6/10, and OpenZFS.",
    category="storage",
    fields=[
        CalcField(
            "raid_type",
            "RAID Configuration",
            type="select",
            default="raid5",
            options=[
                {"value": "shr1", "label": "Synology SHR-1 (Single Drive Protection)"},
                {"value": "shr2", "label": "Synology SHR-2 (Dual Drive Protection)"},
                {"value": "raid0", "label": "RAID 0 (Striping - No Redundancy)"},
                {"value": "raid1", "label": "RAID 1 (Mirroring)"},
                {"value": "raid5", "label": "RAID 5 (Single Distributed Parity)"},
                {"value": "raid6", "label": "RAID 6 (Dual Distributed Parity)"},
                {"value": "raid10", "label": "RAID 10 (Striped Mirrors)"},
                {"value": "raid50", "label": "RAID 50 (Dual Parity Stripes)"},
                {"value": "raid60", "label": "RAID 60 (Dual Dual-Parity Stripes)"},
                {"value": "zfs_z1", "label": "OpenZFS RAID-Z1 (Single Parity)"},
                {"value": "zfs_z2", "label": "OpenZFS RAID-Z2 (Dual Parity)"},
                {"value": "zfs_z3", "label": "OpenZFS RAID-Z3 (Triple Parity)"},
                {"value": "jbod", "label": "JBOD (Just a Bunch of Disks)"},
            ],
            help="Array architecture.",
        ),
        CalcField("disk_count", "Number of Drives", type="number", default=4, min=1, max=64, step=1),
        CalcField("disk_size", "Drive Capacity", type="number", default=8, min=0.1, max=100, step=0.5),
        CalcField(
            "disk_unit",
            "Capacity Unit",
            type="select",
            default="TB",
            options=[
                {"value": "TB", "label": "Terabytes (TB)"},
                {"value": "GB", "label": "Gigabytes (GB)"},
                {"value": "PB", "label": "Petabytes (PB)"},
            ],
        ),
        CalcField("hot_spares", "Hot Spare Disks", type="number", default=0, min=0, max=10, step=1),
        CalcField(
            "disk_type",
            "Drive Media & Quality",
            type="select",
            default="enterprise_hdd",
            options=[
                {"value": "enterprise_hdd", "label": "Enterprise HDD (7200 RPM / URE 10^15)"},
                {"value": "consumer_hdd", "label": "Consumer / NAS HDD (5400-5900 RPM / URE 10^14)"},
                {"value": "sata_ssd", "label": "SATA SSD (TLC / URE 10^16)"},
                {"value": "nvme_ssd", "label": "NVMe PCIe SSD (Enterprise / URE 10^17)"},
            ],
        ),
        CalcField("disk_speed_mb", "Single Disk Sustained Speed (MB/s)", type="number", default=220, min=10, max=7500, step=10),
        CalcField("cost_per_disk", "Cost per Drive ($)", type="number", default=180, min=0, max=5000, step=5),
        CalcField(
            "filesystem",
            "Target Filesystem",
            type="select",
            default="btrfs",
            options=[
                {"value": "btrfs", "label": "Btrfs (4% metadata reserve - Synology DSM default)"},
                {"value": "zfs", "label": "OpenZFS (1.56% slop space - TrueNAS / Proxmox)"},
                {"value": "ext4", "label": "EXT4 (2% reserved inodes - Linux)"},
                {"value": "ntfs", "label": "NTFS / ReFS (1.5% cluster overhead - Windows Server)"},
                {"value": "raw", "label": "Raw Partition (0% overhead)"},
            ],
        ),
    ],
    fn=_raid_calculator,
)
