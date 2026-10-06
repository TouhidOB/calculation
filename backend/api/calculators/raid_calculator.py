"""
RAID Calculator (Array Capacity, Redundancy, Rebuild Time & URE Risk).

Calculates usable storage capacity, fault tolerance, parity overhead,
storage efficiency, read/write throughput multipliers, IOPS write penalties,
rebuild times, and scientific Unrecoverable Read Error (URE) probabilities
across standard (RAID 0, 1, 5, 6, 10), enterprise (RAID 50, 60), JBOD,
and OpenZFS (RAID-Z1, RAID-Z2, RAID-Z3) configurations.
"""
import math
from .engine import CalcField, register_calculator


URE_RATES = {
    "consumer_hdd": 1e-14,    # 1 in 10^14 bits (~12.5 TB)
    "enterprise_hdd": 1e-15,  # 1 in 10^15 bits (~125 TB)
    "sata_ssd": 1e-16,        # 1 in 10^16 bits
    "nvme_ssd": 1e-17,        # 1 in 10^17 bits
}

MIN_DRIVES = {
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


def _calculate_single_raid(
    raid_type: str,
    n_active: int,
    disk_size_tb: float,
    disk_speed_mb: float,
    ure_rate: float
) -> dict:
    """Compute metrics for a specific RAID level and active disk count."""
    min_d = MIN_DRIVES.get(raid_type, 2)
    if n_active < min_d:
        return {
            "valid": False,
            "min_drives": min_d,
            "error": f"Requires minimum {min_d} drives (current active: {n_active})",
        }

    usable_tb = 0.0
    parity_tb = 0.0
    mirror_tb = 0.0
    wasted_tb = 0.0
    fault_tolerance_drives = 0
    read_mult = 1.0
    write_mult = 1.0
    write_penalty = 1
    read_needs_drives = 1

    if raid_type == "raid0":
        usable_tb = n_active * disk_size_tb
        fault_tolerance_drives = 0
        read_mult = float(n_active)
        write_mult = float(n_active)
        write_penalty = 1
        read_needs_drives = n_active

    elif raid_type == "raid1":
        usable_tb = disk_size_tb
        mirror_tb = (n_active - 1) * disk_size_tb
        fault_tolerance_drives = n_active - 1
        read_mult = float(n_active)
        write_mult = 1.0
        write_penalty = 1
        read_needs_drives = 1

    elif raid_type in ("raid5", "zfs_z1"):
        usable_tb = (n_active - 1) * disk_size_tb
        parity_tb = disk_size_tb
        fault_tolerance_drives = 1
        read_mult = max(1.0, float(n_active - 1))
        write_mult = max(0.5, float(n_active) / 4.0)
        write_penalty = 4
        read_needs_drives = n_active - 1

    elif raid_type in ("raid6", "zfs_z2"):
        usable_tb = (n_active - 2) * disk_size_tb
        parity_tb = 2.0 * disk_size_tb
        fault_tolerance_drives = 2
        read_mult = max(1.0, float(n_active - 2))
        write_mult = max(0.4, float(n_active) / 6.0)
        write_penalty = 6
        read_needs_drives = n_active - 1

    elif raid_type == "zfs_z3":
        usable_tb = (n_active - 3) * disk_size_tb
        parity_tb = 3.0 * disk_size_tb
        fault_tolerance_drives = 3
        read_mult = max(1.0, float(n_active - 3))
        write_mult = max(0.3, float(n_active) / 8.0)
        write_penalty = 8
        read_needs_drives = n_active - 1

    elif raid_type == "raid10":
        # Must have even number of active drives
        effective_n = n_active if n_active % 2 == 0 else n_active - 1
        if effective_n < 4:
            return {"valid": False, "min_drives": 4, "error": "RAID 10 requires at least 4 drives in even pairs"}
        if n_active % 2 != 0:
            wasted_tb = disk_size_tb
        usable_tb = (effective_n / 2.0) * disk_size_tb
        mirror_tb = (effective_n / 2.0) * disk_size_tb
        fault_tolerance_drives = 1  # 1 guaranteed, up to effective_n / 2
        read_mult = float(effective_n)
        write_mult = float(effective_n / 2.0)
        write_penalty = 2
        read_needs_drives = 1

    elif raid_type == "raid50":
        # 2 RAID 5 groups of at least 3 drives
        groups = 2
        usable_tb = (n_active - groups) * disk_size_tb
        parity_tb = groups * disk_size_tb
        fault_tolerance_drives = 1  # 1 per group
        read_mult = max(1.0, float(n_active - groups))
        write_mult = max(0.5, float(n_active) / 4.0)
        write_penalty = 4
        read_needs_drives = n_active - groups

    elif raid_type == "raid60":
        # 2 RAID 6 groups of at least 4 drives
        groups = 2
        usable_tb = (n_active - (groups * 2)) * disk_size_tb
        parity_tb = (groups * 2) * disk_size_tb
        fault_tolerance_drives = 2  # 2 per group
        read_mult = max(1.0, float(n_active - (groups * 2)))
        write_mult = max(0.4, float(n_active) / 6.0)
        write_penalty = 6
        read_needs_drives = n_active - (groups * 2)

    elif raid_type == "jbod":
        usable_tb = n_active * disk_size_tb
        fault_tolerance_drives = 0
        read_mult = 1.0
        write_mult = 1.0
        write_penalty = 1
        read_needs_drives = 1

    raw_tb = n_active * disk_size_tb
    efficiency_pct = (usable_tb / raw_tb * 100.0) if raw_tb > 0 else 0.0

    # URE Probability during array rebuild
    # During rebuild of a single failed drive, the controller must read from the remaining drives
    # Bits read = (remaining surviving active drives) * disk_size * 8 * 10^12 bits
    bits_read_during_rebuild = max(0, read_needs_drives) * disk_size_tb * 8.0 * 1e12
    # P(URE) = 1 - (1 - ure_rate)^bits ≈ 1 - exp(-bits * ure_rate)
    exponent = -bits_read_during_rebuild * ure_rate
    if exponent < -50:
        ure_prob_pct = 99.99
    else:
        ure_prob_pct = (1.0 - math.exp(exponent)) * 100.0
    ure_prob_pct = min(99.99, max(0.01, ure_prob_pct))

    # Binary capacity (TiB) and OS format (allowing 2.5% filesystem metadata)
    tib_factor = 1000.0**4 / (1024.0**4)  # ~0.9094947
    usable_tib = usable_tb * tib_factor
    os_formatted_tib = usable_tib * 0.975

    # Speeds
    est_read_speed_mb = round(disk_speed_mb * read_mult, 1)
    est_write_speed_mb = round(disk_speed_mb * write_mult, 1)

    # Rebuild time estimate (assuming 65% disk speed during active rebuild workload)
    rebuild_speed_mb = max(40.0, disk_speed_mb * 0.65)
    disk_mb = disk_size_tb * 1000.0 * 1000.0
    rebuild_time_hours = round(disk_mb / (rebuild_speed_mb * 3600.0), 1)

    return {
        "valid": True,
        "usable_tb": round(usable_tb, 2),
        "usable_tib": round(usable_tib, 2),
        "os_formatted_tib": round(os_formatted_tib, 2),
        "parity_tb": round(parity_tb, 2),
        "mirror_tb": round(mirror_tb, 2),
        "wasted_tb": round(wasted_tb, 2),
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

    # Normalize disk_size to TB
    if disk_unit == "GB":
        disk_size_tb = disk_size / 1000.0
    elif disk_unit == "PB":
        disk_size_tb = disk_size * 1000.0
    else:
        disk_size_tb = disk_size

    ure_rate = URE_RATES.get(disk_type, 1e-15)
    n_active = disk_count - hot_spares

    result = _calculate_single_raid(
        raid_type=raid_type,
        n_active=n_active,
        disk_size_tb=disk_size_tb,
        disk_speed_mb=disk_speed_mb,
        ure_rate=ure_rate,
    )

    if not result.get("valid", False):
        return {
            "error": result.get("error", "Invalid RAID configuration"),
            "valid": False,
            "min_drives": result.get("min_drives", 2),
            "current_drives": disk_count,
        }

    total_raw_tb = round(disk_count * disk_size_tb, 2)
    hot_spare_tb = round(hot_spares * disk_size_tb, 2)
    total_cost = round(disk_count * cost_per_disk, 2)
    cost_per_usable_tb = round((total_cost / result["usable_tb"]), 2) if result["usable_tb"] > 0 else 0.0

    # Build comparison across all standard RAID types for this drive count
    comparison = []
    comparison_levels = [
        ("raid0", "RAID 0 (Stripe)"),
        ("raid1", "RAID 1 (Mirror)"),
        ("raid5", "RAID 5 (Single Parity)"),
        ("raid6", "RAID 6 (Dual Parity)"),
        ("raid10", "RAID 10 (1+0 Stripe of Mirrors)"),
        ("raid50", "RAID 50 (Striped RAID 5)"),
        ("raid60", "RAID 60 (Striped RAID 6)"),
        ("zfs_z1", "OpenZFS RAID-Z1"),
        ("zfs_z2", "OpenZFS RAID-Z2"),
        ("zfs_z3", "OpenZFS RAID-Z3"),
        ("jbod", "JBOD (Spanning)"),
    ]

    for lvl_code, lvl_name in comparison_levels:
        comp_res = _calculate_single_raid(
            raid_type=lvl_code,
            n_active=n_active,
            disk_size_tb=disk_size_tb,
            disk_speed_mb=disk_speed_mb,
            ure_rate=ure_rate,
        )
        if comp_res.get("valid", False):
            comparison.append({
                "level": lvl_code,
                "name": lvl_name,
                "usable_tb": comp_res["usable_tb"],
                "usable_tib": comp_res["usable_tib"],
                "efficiency_pct": comp_res["efficiency_pct"],
                "fault_tolerance": comp_res["fault_tolerance_drives"],
                "write_penalty": comp_res["write_penalty"],
                "read_speed_mb": comp_res["est_read_speed_mb"],
                "write_speed_mb": comp_res["est_write_speed_mb"],
                "rebuild_hours": comp_res["rebuild_time_hours"],
                "ure_risk_pct": comp_res["ure_prob_pct"],
                "is_current": (lvl_code == raid_type),
            })

    # Reliability assessment
    fault_tol = result["fault_tolerance_drives"]
    ure_risk = result["ure_prob_pct"]
    if fault_tol == 0:
        health_verdict = "Critical Risk (Zero Redundancy — Any single disk failure causes complete data loss)"
        risk_level = "extreme"
    elif fault_tol == 1 and ure_risk > 30.0:
        health_verdict = f"High Rebuild Risk (1 drive redundancy with {ure_risk}% URE error probability during rebuild)"
        risk_level = "warning"
    elif fault_tol >= 2:
        health_verdict = f"Enterprise Grade Protection (Survives {fault_tol} simultaneous disk failures)"
        risk_level = "safe"
    else:
        health_verdict = "Standard Redundancy (1 disk failure tolerated)"
        risk_level = "normal"

    return {
        "valid": True,
        "raid_type": raid_type,
        "disk_count": disk_count,
        "disk_size_tb": disk_size_tb,
        "hot_spares": hot_spares,
        "active_drives": n_active,
        "total_raw_tb": total_raw_tb,
        "usable_tb": result["usable_tb"],
        "usable_tib": result["usable_tib"],
        "os_formatted_tib": result["os_formatted_tib"],
        "parity_tb": result["parity_tb"],
        "mirror_tb": result["mirror_tb"],
        "hot_spare_tb": hot_spare_tb,
        "wasted_tb": result["wasted_tb"],
        "efficiency_pct": result["efficiency_pct"],
        "fault_tolerance_drives": fault_tol,
        "write_penalty": result["write_penalty"],
        "est_read_speed_mb": result["est_read_speed_mb"],
        "est_write_speed_mb": result["est_write_speed_mb"],
        "rebuild_time_hours": result["rebuild_time_hours"],
        "ure_prob_pct": result["ure_prob_pct"],
        "total_cost": total_cost,
        "cost_per_usable_tb": cost_per_usable_tb,
        "health_verdict": health_verdict,
        "risk_level": risk_level,
        "comparison": comparison,
    }


register_calculator(
    id="raid-calculator",
    name="RAID Calculator",
    category="storage",
    description="Calculate usable storage capacity, fault tolerance, parity overhead, read/write speed multipliers, and rebuild URE risk for RAID 0, 1, 5, 6, 10, 50, 60, JBOD, and OpenZFS RAID-Z1/Z2/Z3.",
    fields=[
        CalcField(
            name="raid_type",
            label="RAID Configuration Level",
            type="select",
            default="raid5",
            options=[
                {"value": "raid0", "label": "RAID 0 (Striping — Maximum Speed, No Redundancy)"},
                {"value": "raid1", "label": "RAID 1 (Mirroring — 100% Redundancy, 2+ Drives)"},
                {"value": "raid5", "label": "RAID 5 (Single Distributed Parity — Min 3 Drives)"},
                {"value": "raid6", "label": "RAID 6 (Dual Distributed Parity — Min 4 Drives)"},
                {"value": "raid10", "label": "RAID 10 / 1+0 (Striped Mirrors — Min 4 Drives)"},
                {"value": "raid50", "label": "RAID 50 (Striped RAID 5 Sets — Min 6 Drives)"},
                {"value": "raid60", "label": "RAID 60 (Striped RAID 6 Sets — Min 8 Drives)"},
                {"value": "zfs_z1", "label": "OpenZFS RAID-Z1 (Single Parity — Min 3 Drives)"},
                {"value": "zfs_z2", "label": "OpenZFS RAID-Z2 (Dual Parity — Min 4 Drives)"},
                {"value": "zfs_z3", "label": "OpenZFS RAID-Z3 (Triple Parity — Min 5 Drives)"},
                {"value": "jbod", "label": "JBOD (Just a Bunch of Disks — Linear Spanning)"},
            ],
            help="Select the RAID or OpenZFS volume architecture.",
        ),
        CalcField(
            name="disk_count",
            label="Number of Disks",
            type="number",
            default=4,
            min=1,
            max=64,
            step=1,
            unit="drives",
            help="Total drives installed in the storage enclosure or NAS bay.",
        ),
        CalcField(
            name="disk_size",
            label="Individual Drive Capacity",
            type="number",
            default=8,
            min=0.1,
            max=100,
            step=0.5,
            help="Advertised capacity per individual drive (e.g. 4, 8, 12, 16, 20 TB).",
        ),
        CalcField(
            name="disk_unit",
            label="Capacity Unit",
            type="select",
            default="TB",
            options=[
                {"value": "TB", "label": "Terabytes (TB)"},
                {"value": "GB", "label": "Gigabytes (GB)"},
                {"value": "PB", "label": "Petabytes (PB)"},
            ],
        ),
        CalcField(
            name="hot_spares",
            label="Dedicated Hot Spares",
            type="number",
            default=0,
            min=0,
            max=8,
            step=1,
            unit="drives",
            help="Standby idle drives reserved to automatically rebuild upon disk failure.",
        ),
        CalcField(
            name="disk_type",
            label="Drive Class & Media Type",
            type="select",
            default="enterprise_hdd",
            options=[
                {"value": "enterprise_hdd", "label": "Enterprise / NAS HDD (10^15 URE rate — IronWolf Pro / WD Red Pro)"},
                {"value": "consumer_hdd", "label": "Desktop / Consumer HDD (10^14 URE rate — Barracuda / WD Blue)"},
                {"value": "sata_ssd", "label": "SATA SSD (10^16 URE rate — Samsung EVO / Crucial)"},
                {"value": "nvme_ssd", "label": "NVMe PCIe SSD (10^17 URE rate — Enterprise NVMe)"},
            ],
            help="Drive media determines scientific Unrecoverable Read Error (URE) probability during rebuild.",
        ),
        CalcField(
            name="disk_speed_mb",
            label="Average Single Drive Speed",
            type="number",
            default=220,
            min=20,
            max=7000,
            step=10,
            unit="MB/s",
            help="Sustained sequential read/write throughput per drive (e.g. 200-260 MB/s for HDD, 500 MB/s for SATA SSD, 3500+ MB/s for NVMe).",
        ),
        CalcField(
            name="cost_per_disk",
            label="Cost per Drive",
            type="number",
            default=180,
            min=0,
            max=10000,
            step=5,
            unit="$",
            help="Drive purchase price to estimate total CapEx hardware spend and cost per usable TB.",
        ),
    ],
    fn=_raid_calculator,
)
