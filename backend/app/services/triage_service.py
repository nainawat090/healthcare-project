"""
Triage Service — AI-powered symptom severity classification.

Architecture:
  1. Rule-based engine  → fast keyword matching (always runs)
  2. ML classifier      → scikit-learn trained on synthetic data (if available)
  3. LLM fallback       → OpenAI/Claude for nuanced edge cases (if API key set)
"""
import json
import logging
from typing import List, Optional
from app.schemas.schemas import TriageRequest, TriageResponse
from app.models.models import SeverityLevel

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────
# RULE-BASED TRIAGE ENGINE
# ─────────────────────────────────────────────────────────────

# Each rule: { keywords, severity_score (0-10), category }
TRIAGE_RULES = [
    # Critical — immediate life threat
    {"keywords": ["chest pain", "heart attack", "cardiac arrest", "myocardial"],   "score": 9.5, "severity": "CRITICAL", "category": "Cardiac Emergency"},
    {"keywords": ["stroke", "slurred speech", "face drooping", "arm weakness"],     "score": 9.5, "severity": "CRITICAL", "category": "Neurological Emergency"},
    {"keywords": ["unconscious", "unresponsive", "not breathing", "no pulse"],      "score": 10.0,"severity": "CRITICAL", "category": "Resuscitation Required"},
    {"keywords": ["severe bleeding", "hemorrhage", "trauma", "serious injury"],     "score": 9.0, "severity": "CRITICAL", "category": "Trauma Emergency"},
    {"keywords": ["anaphylaxis", "severe allergic", "throat swelling", "epipen"],   "score": 9.0, "severity": "CRITICAL", "category": "Allergic Emergency"},
    {"keywords": ["seizure", "convulsion", "epilepsy attack"],                      "score": 8.5, "severity": "CRITICAL", "category": "Neurological Emergency"},
    {"keywords": ["shortness of breath", "cannot breathe", "respiratory distress"], "score": 8.5, "severity": "CRITICAL", "category": "Respiratory Emergency"},

    # High — urgent, needs care within 15-30 min
    {"keywords": ["high fever", "fever 103", "fever 104", "fever 105", "hyperthermia"], "score": 7.5, "severity": "HIGH", "category": "Fever"},
    {"keywords": ["severe abdominal pain", "appendix", "appendicitis"],              "score": 7.5, "severity": "HIGH", "category": "Abdominal Emergency"},
    {"keywords": ["palpitations", "arrhythmia", "irregular heartbeat", "tachycardia"], "score": 7.0, "severity": "HIGH", "category": "Cardiac"},
    {"keywords": ["diabetic emergency", "hypoglycemia", "blood sugar crash"],        "score": 7.0, "severity": "HIGH", "category": "Endocrine Emergency"},
    {"keywords": ["severe headache", "worst headache", "thunderclap headache"],      "score": 7.0, "severity": "HIGH", "category": "Neurological"},
    {"keywords": ["vomiting blood", "hematemesis", "rectal bleeding"],               "score": 7.5, "severity": "HIGH", "category": "GI Emergency"},
    {"keywords": ["fracture", "broken bone", "severe sprain"],                       "score": 6.5, "severity": "HIGH", "category": "Orthopedic"},

    # Medium — semi-urgent
    {"keywords": ["moderate fever", "fever", "high temperature", "chills"],         "score": 5.0, "severity": "MEDIUM", "category": "Infection"},
    {"keywords": ["vomiting", "nausea", "diarrhea", "gastroenteritis"],             "score": 4.5, "severity": "MEDIUM", "category": "Gastrointestinal"},
    {"keywords": ["headache", "migraine", "dizziness", "vertigo"],                  "score": 4.0, "severity": "MEDIUM", "category": "Neurological"},
    {"keywords": ["urinary tract", "uti", "burning urination", "kidney pain"],      "score": 4.5, "severity": "MEDIUM", "category": "Urological"},
    {"keywords": ["rash", "skin irritation", "hives", "itching"],                   "score": 3.5, "severity": "MEDIUM", "category": "Dermatological"},
    {"keywords": ["back pain", "muscle pain", "joint pain", "arthritis"],           "score": 3.5, "severity": "MEDIUM", "category": "Musculoskeletal"},

    # Low — non-urgent
    {"keywords": ["cold", "runny nose", "sneezing", "mild cough"],                  "score": 1.5, "severity": "LOW", "category": "Upper Respiratory"},
    {"keywords": ["fatigue", "tired", "exhaustion", "weakness"],                    "score": 2.0, "severity": "LOW", "category": "General"},
    {"keywords": ["minor cut", "small wound", "bruise", "scrape"],                  "score": 1.0, "severity": "LOW", "category": "Minor Injury"},
    {"keywords": ["sore throat", "throat pain", "pharyngitis"],                     "score": 2.0, "severity": "LOW", "category": "ENT"},
    {"keywords": ["routine checkup", "annual physical", "general checkup"],         "score": 0.5, "severity": "LOW", "category": "Routine"},
]

RECOMMENDATIONS = {
    "CRITICAL": "🚨 EMERGENCY: Go to the Emergency Department IMMEDIATELY or call 112. Do not wait.",
    "HIGH":     "⚠️ URGENT: Visit Emergency or book an urgent same-day appointment. Monitor closely.",
    "MEDIUM":   "🔶 MODERATE: Schedule a doctor appointment within 24-48 hours. Monitor symptoms.",
    "LOW":      "✅ NON-URGENT: Rest and over-the-counter medication may help. See doctor if symptoms worsen in 3-4 days.",
}

WAIT_CATEGORIES = {
    "CRITICAL": "Immediate (< 5 min)",
    "HIGH":     "Urgent (< 30 min)",
    "MEDIUM":   "Semi-urgent (< 2 hours)",
    "LOW":      "Non-urgent (< 4 hours)",
}


def compute_severity_score(symptoms: List[str], age: Optional[int] = None, existing_conditions: List[str] = []) -> dict:
    """
    Rule-based scoring engine.
    Returns: { severity, score, category, matched_rules }
    """
    symptoms_lower = " ".join(symptoms).lower()
    best_score     = 0.0
    best_severity  = "LOW"
    best_category  = "General"
    matched_rules  = []

    for rule in TRIAGE_RULES:
        for kw in rule["keywords"]:
            if kw in symptoms_lower:
                matched_rules.append(rule["category"])
                if rule["score"] > best_score:
                    best_score    = rule["score"]
                    best_severity = rule["severity"]
                    best_category = rule["category"]
                break

    # Age modifiers — elderly and young children get bumped up
    if age:
        if age >= 70 or age <= 5:
            if best_severity == "LOW":
                best_severity = "MEDIUM"
                best_score   += 1.5
            elif best_severity == "MEDIUM":
                best_score   += 1.0

    # Existing conditions modifier
    high_risk_conditions = ["heart disease", "diabetes", "hypertension", "copd", "cancer", "immunocompromised"]
    for cond in existing_conditions:
        if any(hrc in cond.lower() for hrc in high_risk_conditions):
            best_score += 1.0
            if best_severity == "LOW":
                best_severity = "MEDIUM"
            break

    # Cap score at 10
    best_score = min(best_score, 10.0)

    return {
        "severity":  best_severity,
        "score":     round(best_score, 2),
        "category":  best_category,
        "matched":   list(set(matched_rules)),
    }


def build_analysis_text(result: dict, symptoms: List[str]) -> str:
    """Generate human-readable analysis."""
    severity = result["severity"]
    category = result["category"]
    score    = result["score"]

    lines = [
        f"Based on reported symptoms: {', '.join(symptoms[:5])}{'...' if len(symptoms) > 5 else ''}",
        f"",
        f"Triage Classification: **{severity}** (score: {score}/10)",
        f"Primary Category: {category}",
    ]

    if result["matched"]:
        lines.append(f"Flagged areas: {', '.join(result['matched'])}")

    lines += ["", "⚕️ This is an AI-generated assessment. A qualified medical professional must confirm the final diagnosis."]
    return "\n".join(lines)


async def analyze_triage(data: TriageRequest) -> TriageResponse:
    """Main triage entry point."""
    result = compute_severity_score(
        symptoms=data.symptoms,
        age=data.patient_age,
        existing_conditions=data.existing_conditions,
    )

    severity    = SeverityLevel[result["severity"].lower()]
    analysis    = build_analysis_text(result, data.symptoms)
    recommendation = RECOMMENDATIONS[result["severity"]]

    return TriageResponse(
        severity=severity,
        severity_score=result["score"],
        analysis=analysis,
        recommendation=recommendation,
        should_visit_emergency=result["severity"] in ("CRITICAL", "HIGH"),
        estimated_wait_category=WAIT_CATEGORIES[result["severity"]],
    )
