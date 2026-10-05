"""
CCTV & NVR Surveillance Storage and Bandwidth Calculator.

Calculates NVR/DVR hard drive storage requirements, incoming network bandwidth,
daily recording ingestion, RAID redundancy overhead, and surveillance hard drive
recommendations (WD Purple / Seagate SkyHawk) based on camera count, resolution,
FPS, video compression codecs (H.264/H.265/H.265+), and retention schedules.

Calibrated against official documentation and whitepapers from:
- Western Digital (WD Purple Surveillance Storage Calculator)
- Seagate Technology (SkyHawk Surveillance Sizing Guide)
- Hikvision (Storage and Network Calculator User Manual)
- Dahua Technology (ToolBox Bandwidth & Storage Calculator)
- Axis Communications (Bandwidth & Storage Guidelines)
"""
import math
from typing import Any, Dict, List
from .engine import CalcField, register_calculator

# Base video bitrate in Mbps at 15 FPS (surveillance standard) under H.264 baseline & medium activity
RESOLUTION_BASE_BITRATE_MBPS: Dict[str, float] = {
    "720p": 1.50,       # 1MP (1280 x 720)
    "1080p": 2.50,      # 2MP Full HD (1920 x 1080)
    "3mp": 3.50,        # 3MP (2048 x 1536)
    "4mp": 4.50,        # 4MP / 2K QHD (2560 x 1440 or 2688 x 1520)
    "5mp": 5.50,        # 5MP Super HD (2592 x 1944)
    "6mp": 6.50,        # 6MP (3072 x 2048)
    "4k": 8.00,         # 8MP / 4K Ultra HD (3840 x 2160)
    "12mp": 12.00,      # 12MP Ultra (4000 x 3000)
}

RESOLUTION_LABELS: Dict[str, str] = {
    "720p": "720p / 1MP (1280 × 720)",
    "1080p": "1080p / 2MP Full HD (1920 × 1080)",
    "3mp": "3MP (2048 × 1536)",
    "4mp": "4MP / 2K QHD (2560 × 1440)",
    "5mp": "5MP (2592 × 1944)",
    "6mp": "6MP (3072 × 2048)",
    "4k": "8MP / 4K UHD (3840 × 2160)",
    "12mp": "12MP Ultra (4000 × 3000)",
}

# Codec efficiency multiplier relative to baseline H.264
CODEC_EFFICIENCY: Dict[str, float] = {
    "h264": 1.00,        # Standard AVC Baseline
    "h264_plus": 0.70,   # Smart H.264 (30% savings)
    "h265": 0.50,        # HEVC Standard (50% savings)
    "h265_plus": 0.30,   # Smart H.265 / Hikvision H.265+ / Dahua Smart HEVC (70% savings)
    "mjpeg": 2.80,       # Legacy intra-frame
}

CODEC_LABELS: Dict[str, str] = {
    "h264": "H.264 (AVC Baseline)",
    "h264_plus": "H.264+ (Smart H.264 - 30% Savings)",
    "h265": "H.265 (HEVC Standard - 50% Savings)",
    "h265_plus": "H.265+ (Smart Codec - 70% Savings)",
    "mjpeg": "MJPEG (Legacy Uncompressed)",
}

# Scene motion complexity factor
MOTION_FACTORS: Dict[str, float] = {
    "low": 0.80,         # Static room, hallway, night warehouse (~20% activity)
    "medium": 1.00,      # Normal office, retail shop, residential driveway (~40-50% activity)
    "high": 1.30,        # Busy public street, supermarket checkout, traffic (~80% activity)
}

# Standard surveillance certified HDD capacities (TB)
SURVEILLANCE_DRIVES = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]


def _recommend_drives(required_tb: float, raid_mode: str) -> Dict[str, Any]:
    """Determine optimal drive configuration and NVR bay sizing."""
    target_tb = max(1.0, required_tb)

    if raid_mode == "raid1":
        # Needs pairs of mirrored drives
        half_needed = target_tb
        drive_size = 2
        for sz in SURVEILLANCE_DRIVES:
            if sz >= half_needed:
                drive_size = sz
                break
            drive_size = sz
        qty = max(2, int(math.ceil((target_tb * 2.0) / drive_size)))
        if qty % 2 != 0:
            qty += 1
        usable_tb = (qty // 2) * drive_size
        raw_tb = qty * drive_size
        bay_text = f"{qty}-Bay NVR" if qty <= 8 else f"{qty}-Bay Rackmount NVR / Storage Server"
        return {
            "drive_size_tb": drive_size,
            "quantity": qty,
            "raw_total_tb": raw_tb,
            "usable_tb": usable_tb,
            "drive_model": f"{qty} × {drive_size}TB WD Purple / Seagate SkyHawk",
            "nvr_bays": bay_text,
            "raid_usable_ratio": "50% Usable (Mirroring Redundancy)",
        }

    elif raid_mode == "raid5":
        # Min 3 drives, (N-1) usable
        best_cfg = None
        for n_drives in range(3, 9):
            d_size = 2
            for sz in SURVEILLANCE_DRIVES:
                if sz * (n_drives - 1) >= target_tb:
                    d_size = sz
                    break
                d_size = sz
            usable = d_size * (n_drives - 1)
            raw = d_size * n_drives
            if usable >= target_tb:
                best_cfg = (d_size, n_drives, usable, raw)
                break
        if not best_cfg:
            best_cfg = (16, 4, 48, 64)

        d_size, qty, usable, raw = best_cfg
        bay_text = f"{qty}-Bay NVR" if qty <= 8 else f"{qty}-Bay Rackmount NVR"
        return {
            "drive_size_tb": d_size,
            "quantity": qty,
            "raw_total_tb": raw,
            "usable_tb": usable,
            "drive_model": f"{qty} × {d_size}TB WD Purple / Seagate SkyHawk",
            "nvr_bays": bay_text,
            "raid_usable_ratio": f"{int(((qty-1)/qty)*100)}% Usable (1-Drive Parity Protection)",
        }

    elif raid_mode == "raid6":
        # Min 4 drives, (N-2) usable
        best_cfg = None
        for n_drives in range(4, 9):
            d_size = 4
            for sz in SURVEILLANCE_DRIVES:
                if sz * (n_drives - 2) >= target_tb:
                    d_size = sz
                    break
                d_size = sz
            usable = d_size * (n_drives - 2)
            raw = d_size * n_drives
            if usable >= target_tb:
                best_cfg = (d_size, n_drives, usable, raw)
                break
        if not best_cfg:
            best_cfg = (16, 6, 64, 96)

        d_size, qty, usable, raw = best_cfg
        bay_text = f"{qty}-Bay NVR / SAN"
        return {
            "drive_size_tb": d_size,
            "quantity": qty,
            "raw_total_tb": raw,
            "usable_tb": usable,
            "drive_model": f"{qty} × {d_size}TB WD Purple Pro / SkyHawk AI",
            "nvr_bays": bay_text,
            "raid_usable_ratio": f"{int(((qty-2)/qty)*100)}% Usable (2-Drive Parity Dual Protection)",
        }

    elif raid_mode == "raid10":
        # Min 4 drives, 50% usable
        half_needed = target_tb
        d_size = 4
        for sz in SURVEILLANCE_DRIVES:
            if sz * 2 >= half_needed:
                d_size = sz
                break
            d_size = sz
        qty = max(4, int(math.ceil((target_tb * 2.0) / d_size)))
        if qty % 2 != 0:
            qty += 1
        usable = (qty // 2) * d_size
        raw = qty * d_size
        bay_text = f"{qty}-Bay NVR / SAN"
        return {
            "drive_size_tb": d_size,
            "quantity": qty,
            "raw_total_tb": raw,
            "usable_tb": usable,
            "drive_model": f"{qty} × {d_size}TB WD Purple / SkyHawk",
            "nvr_bays": bay_text,
            "raid_usable_ratio": "50% Usable (Speed & Striped Mirroring)",
        }

    else:
        # Single / JBOD / Non-RAID
        d_size = 2
        for sz in SURVEILLANCE_DRIVES:
            if sz >= target_tb:
                d_size = sz
                break
            d_size = sz
        qty = max(1, int(math.ceil(target_tb / d_size)))
        raw = qty * d_size
        bay_text = f"{qty}-Bay NVR" if qty <= 4 else f"{qty}-Bay Rackmount NVR"
        return {
            "drive_size_tb": d_size,
            "quantity": qty,
            "raw_total_tb": raw,
            "usable_tb": raw,
            "drive_model": f"{qty} × {d_size}TB WD Purple / Seagate SkyHawk",
            "nvr_bays": bay_text,
            "raid_usable_ratio": "100% Usable (Standard JBOD Storage)",
        }


def _cctv_storage_calculator(values: dict) -> dict:
    """Core calculation engine for CCTV storage and bandwidth."""
    try:
        cameras = max(1, min(256, int(round(float(values.get("cameras") or 4)))))
    except (ValueError, TypeError):
        cameras = 4

    resolution = str(values.get("resolution") or "1080p").lower()
    if resolution not in RESOLUTION_BASE_BITRATE_MBPS:
        resolution = "1080p"

    try:
        fps = max(1.0, min(60.0, float(values.get("fps") or 15)))
    except (ValueError, TypeError):
        fps = 15.0

    codec = str(values.get("codec") or "h265").lower()
    if codec not in CODEC_EFFICIENCY:
        codec = "h265"

    motion = str(values.get("motion_activity") or "medium").lower()
    if motion not in MOTION_FACTORS:
        motion = "medium"

    try:
        hours_per_day = max(1.0, min(24.0, float(values.get("hours_per_day") or 24)))
    except (ValueError, TypeError):
        hours_per_day = 24.0

    try:
        retention_days = max(1, min(365, int(round(float(values.get("retention_days") or 30)))))
    except (ValueError, TypeError):
        retention_days = 30

    audio_opt = str(values.get("audio") or "no").lower()
    audio_enabled = audio_opt in ("yes", "true", "1")

    try:
        buffer_pct = max(0.0, min(100.0, float(values.get("buffer_percent") or 20.0)))
    except (ValueError, TypeError):
        buffer_pct = 20.0

    raid_mode = str(values.get("raid_mode") or "none").lower()
    if raid_mode not in ("none", "raid0", "raid1", "raid5", "raid6", "raid10"):
        raid_mode = "none"

    # 1. Base bitrate and scaling
    base_bitrate = RESOLUTION_BASE_BITRATE_MBPS[resolution]
    fps_scale = (fps / 15.0) ** 0.75
    codec_factor = CODEC_EFFICIENCY[codec]
    motion_factor = MOTION_FACTORS[motion]
    audio_bitrate_mbps = 0.064 if audio_enabled else 0.0

    video_bitrate_mbps = base_bitrate * fps_scale * codec_factor * motion_factor
    single_cam_bitrate_mbps = video_bitrate_mbps + audio_bitrate_mbps
    single_cam_bitrate_kbps = single_cam_bitrate_mbps * 1000.0

    # 2. Total network bandwidth
    total_bandwidth_mbps = single_cam_bitrate_mbps * cameras

    # 3. Daily storage ingestion
    # 1 byte = 8 bits, 1 GB = 1000 MB (decimal storage as labeled by HDD vendors)
    daily_storage_per_cam_gb = (single_cam_bitrate_mbps * 3600.0 * hours_per_day) / (8.0 * 1000.0)
    daily_storage_total_gb = daily_storage_per_cam_gb * cameras

    # 4. Total retention storage
    raw_storage_gb = daily_storage_total_gb * retention_days
    raw_storage_tb = raw_storage_gb / 1000.0

    buffer_factor = 1.0 + (buffer_pct / 100.0)
    recommended_storage_tb = raw_storage_tb * buffer_factor
    recommended_storage_tib = (raw_storage_gb * buffer_factor) / 1024.0

    # 5. Hardware Drive Recommendations
    drive_rec = _recommend_drives(recommended_storage_tb, raid_mode)

    # 6. Codec Savings Comparison Matrix
    comparison_codecs = ["h264", "h264_plus", "h265", "h265_plus"]
    h264_base_tb = None
    codec_matrix = []

    for c in comparison_codecs:
        c_factor = CODEC_EFFICIENCY[c]
        c_cam_mbps = (base_bitrate * fps_scale * c_factor * motion_factor) + audio_bitrate_mbps
        c_daily_gb = ((c_cam_mbps * 3600.0 * hours_per_day) / (8.0 * 1000.0)) * cameras
        c_raw_tb = (c_daily_gb * retention_days) / 1000.0
        c_rec_tb = c_raw_tb * buffer_factor
        if c == "h264":
            h264_base_tb = c_rec_tb

        savings_tb = max(0.0, (h264_base_tb or c_rec_tb) - c_rec_tb) if h264_base_tb else 0.0
        savings_pct = (savings_tb / h264_base_tb * 100.0) if (h264_base_tb and h264_base_tb > 0) else 0.0

        codec_matrix.append({
            "codec": c,
            "label": CODEC_LABELS[c],
            "bitrate_per_cam_mbps": round(c_cam_mbps, 2),
            "total_bandwidth_mbps": round(c_cam_mbps * cameras, 2),
            "storage_tb": round(c_rec_tb, 2),
            "savings_tb": round(savings_tb, 2),
            "savings_percent": round(savings_pct, 1),
            "is_current": (c == codec),
        })

    # 7. Retention Milestones Breakdown
    milestones = [7, 14, 30, 60, 90, 180]
    retention_breakdown = []
    for d in milestones:
        m_gb = daily_storage_total_gb * d
        m_tb = (m_gb / 1000.0) * buffer_factor
        retention_breakdown.append({
            "days": d,
            "storage_gb": round(m_gb * buffer_factor, 1),
            "storage_tb": round(m_tb, 2),
            "is_selected": (d == retention_days),
        })

    # 8. Network switch & NVR throughput assessment
    if total_bandwidth_mbps <= 80:
        switch_recommendation = "Standard 100 Mbps Fast Ethernet Switch / Entry NVR (80 Mbps max)"
        switch_tier = "low"
    elif total_bandwidth_mbps <= 200:
        switch_recommendation = "Gigabit Uplink PoE Switch / Commercial NVR (160-256 Mbps throughput)"
        switch_tier = "medium"
    elif total_bandwidth_mbps <= 600:
        switch_recommendation = "Managed Gigabit PoE+ Switch with 10G SFP+ Uplink / Enterprise NVR (384-640 Mbps)"
        switch_tier = "high"
    else:
        switch_recommendation = "Dedicated Surveillance VLAN on 10GbE Fiber Backbone / SAN Array"
        switch_tier = "critical"

    return {
        "status": "ok",
        "parameters": {
            "cameras": cameras,
            "resolution": resolution,
            "resolution_label": RESOLUTION_LABELS[resolution],
            "fps": fps,
            "codec": codec,
            "codec_label": CODEC_LABELS[codec],
            "motion_activity": motion,
            "hours_per_day": hours_per_day,
            "retention_days": retention_days,
            "audio_enabled": audio_enabled,
            "buffer_percent": buffer_pct,
            "raid_mode": raid_mode.upper(),
        },
        "bitrate": {
            "single_camera_mbps": round(single_cam_bitrate_mbps, 2),
            "single_camera_kbps": int(round(single_cam_bitrate_kbps)),
            "total_bandwidth_mbps": round(total_bandwidth_mbps, 2),
            "switch_rating": switch_recommendation,
            "switch_tier": switch_tier,
        },
        "storage": {
            "daily_per_camera_gb": round(daily_storage_per_cam_gb, 2),
            "daily_total_gb": round(daily_storage_total_gb, 2),
            "raw_storage_gb": round(raw_storage_gb, 2),
            "raw_storage_tb": round(raw_storage_tb, 2),
            "buffer_percent": buffer_pct,
            "recommended_storage_tb": round(recommended_storage_tb, 2),
            "recommended_storage_tib": round(recommended_storage_tib, 2),
        },
        "hardware_recommendation": drive_rec,
        "codec_comparison": codec_matrix,
        "retention_breakdown": retention_breakdown,
    }


# Register with central engine
register_calculator(
    "cctv-storage-calculator",
    "CCTV Storage & Bandwidth Calculator",
    "conversion",
    "Calculate CCTV & NVR hard drive storage, network bandwidth (Mbps), daily recording ingestion, RAID redundancy, and Western Digital / Seagate surveillance drive requirements based on camera count, resolution, FPS, and H.265/H.264 codecs.",
    fields=[
        CalcField(
            "cameras",
            "Number of Cameras",
            type="number",
            default=4,
            min=1,
            max=256,
            step=1,
            help="Total number of surveillance IP or analog cameras.",
        ),
        CalcField(
            "resolution",
            "Camera Resolution",
            type="select",
            default="1080p",
            options=[
                {"value": "720p", "label": "720p / 1MP (1280 × 720)"},
                {"value": "1080p", "label": "1080p / 2MP Full HD (1920 × 1080)"},
                {"value": "3mp", "label": "3MP (2048 × 1536)"},
                {"value": "4mp", "label": "4MP / 2K QHD (2560 × 1440)"},
                {"value": "5mp", "label": "5MP (2592 × 1944)"},
                {"value": "6mp", "label": "6MP (3072 × 2048)"},
                {"value": "4k", "label": "8MP / 4K UHD (3840 × 2160)"},
                {"value": "12mp", "label": "12MP Ultra (4000 × 3000)"},
            ],
            help="Video capture resolution per camera.",
        ),
        CalcField(
            "fps",
            "Frame Rate (FPS)",
            type="select",
            default="15",
            options=[
                {"value": "5", "label": "5 FPS (Low Bandwidth / Parking)"},
                {"value": "10", "label": "10 FPS (Standard Economy)"},
                {"value": "15", "label": "15 FPS (Recommended Surveillance Standard)"},
                {"value": "20", "label": "20 FPS (High Activity)"},
                {"value": "25", "label": "25 FPS (PAL Real-Time)"},
                {"value": "30", "label": "30 FPS (NTSC Full Motion)"},
            ],
            help="Frames per second. 15 FPS is the surveillance industry sweet-spot.",
        ),
        CalcField(
            "codec",
            "Video Compression Codec",
            type="select",
            default="h265",
            options=[
                {"value": "h264", "label": "H.264 (AVC Baseline)"},
                {"value": "h264_plus", "label": "H.264+ (Smart H.264 - 30% Savings)"},
                {"value": "h265", "label": "H.265 (HEVC Standard - 50% Savings)"},
                {"value": "h265_plus", "label": "H.265+ (Smart Codec - 70% Savings)"},
                {"value": "mjpeg", "label": "MJPEG (Legacy Uncompressed)"},
            ],
            help="Video compression codec. Modern H.265+ delivers up to 70% storage savings.",
        ),
        CalcField(
            "motion_activity",
            "Scene Motion / Complexity",
            type="select",
            default="medium",
            options=[
                {"value": "low", "label": "Low (~20% Motion, Static Room / Hallway)"},
                {"value": "medium", "label": "Medium (~40-50% Motion, Office / Retail)"},
                {"value": "high", "label": "High (~80% Motion, Active Street / Cashier)"},
            ],
            help="Expected movement activity in the camera field of view.",
        ),
        CalcField(
            "hours_per_day",
            "Recording Hours per Day",
            type="number",
            default=24,
            min=1,
            max=24,
            step=1,
            help="Hours recorded per day (24 for continuous 24/7 recording).",
        ),
        CalcField(
            "retention_days",
            "Storage Retention (Days)",
            type="number",
            default=30,
            min=1,
            max=365,
            step=1,
            help="Number of days video recordings must be preserved before overwriting.",
        ),
        CalcField(
            "audio",
            "Audio Stream",
            type="select",
            default="no",
            options=[
                {"value": "no", "label": "No Audio"},
                {"value": "yes", "label": "Yes (64 kbps G.711 / AAC)"},
            ],
            help="Include synchronized audio stream per camera.",
        ),
        CalcField(
            "buffer_percent",
            "Safety Buffer Headroom (%)",
            type="number",
            default=20,
            min=0,
            max=50,
            step=5,
            help="Recommended 20% margin for filesystem formatting overhead and VBR bitrate spikes.",
        ),
        CalcField(
            "raid_mode",
            "RAID Configuration",
            type="select",
            default="none",
            options=[
                {"value": "none", "label": "None / JBOD (100% Usable Storage)"},
                {"value": "raid0", "label": "RAID 0 (Striping - No Redundancy)"},
                {"value": "raid1", "label": "RAID 1 (Mirroring - 50% Usable)"},
                {"value": "raid5", "label": "RAID 5 (Single Parity - Min 3 Drives)"},
                {"value": "raid6", "label": "RAID 6 (Dual Parity - Min 4 Drives)"},
                {"value": "raid10", "label": "RAID 10 (Striped Mirrors - 50% Usable)"},
            ],
            help="Storage redundancy array type.",
        ),
    ],
    fn=_cctv_storage_calculator,
)
