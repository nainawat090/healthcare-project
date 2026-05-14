from app.schemas.schemas import VitalCreate

# ── Normal ranges ─────────────────────────────────────────────
RANGES = {
    "heart_rate":   (60,  100),
    "systolic_bp":  (90,  140),
    "diastolic_bp": (60,  90),
    "temperature":  (97.0, 99.0),
    "spo2":         (95,  100),
    "resp_rate":    (12,  20),
}

# Vitals that warrant an immediate alert if out of range
CRITICAL_VITALS = {"spo2", "heart_rate", "systolic_bp"}


def check_vitals_abnormal(data: VitalCreate) -> tuple[bool, bool]:
    """
    Returns (is_abnormal: bool, alert_triggered: bool).
    alert_triggered=True means a critical vital is out of range.
    """
    abnormal_fields = []
    critical_alert  = False

    checks = {
        "heart_rate":   data.heart_rate,
        "systolic_bp":  data.systolic_bp,
        "diastolic_bp": data.diastolic_bp,
        "temperature":  data.temperature,
        "spo2":         data.spo2,
        "resp_rate":    data.resp_rate,
    }

    for field, value in checks.items():
        if value is None:
            continue
        lo, hi = RANGES[field]
        if value < lo or value > hi:
            abnormal_fields.append(field)
            if field in CRITICAL_VITALS:
                critical_alert = True

    return bool(abnormal_fields), critical_alert
