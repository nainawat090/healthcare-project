"""
Chatbot Service — AI patient assistant powered by Google Gemini 2.5.

Uses:
  1. Google Gemini 2.5 API (if GEMINI_API_KEY is set)
  2. Rule-based fallback engine (always available, no key needed)

Safety rules:
  - Never claims to replace a doctor
  - Always adds medical disclaimer
  - Escalates critical symptoms immediately
  - Supports English and Hindi
"""
import logging
from typing import List, Optional
from app.schemas.schemas import ChatMessage, ChatRequest, ChatResponse
from app.core.config import settings
from app.services.triage_service import compute_severity_score, TRIAGE_RULES

logger = logging.getLogger(__name__)

# ── System prompt ─────────────────────────────────────────────
SYSTEM_PROMPT_EN = """You are MediBot, a professional AI health assistant at a hospital. Your role is to:
1. Greet patients warmly and professionally
2. Collect symptom information step by step
3. Assess severity and provide preliminary guidance
4. Help with appointment booking navigation
5. Explain medical reports in simple language
6. Direct patients to emergency care when needed

STRICT RULES:
- NEVER diagnose or prescribe medication
- ALWAYS add the disclaimer: "This is AI guidance only — please consult a doctor"
- For symptoms like chest pain, stroke, unconsciousness → immediately say: "EMERGENCY: Please go to the Emergency Department or call 112 NOW"
- Be empathetic, clear, and concise
- Use simple, non-medical language when explaining to patients
- If severity appears HIGH or CRITICAL, urgently recommend seeing a doctor

You can discuss:
- Symptom information and guidance
- Hospital navigation (appointments, departments, doctors)
- Medical reports in simple language
- General health tips

Format your responses clearly. Use bullet points when listing items.
"""

SYSTEM_PROMPT_HI = """आप मेडीबॉट हैं, एक अस्पताल में पेशेवर AI स्वास्थ्य सहायक। आपकी भूमिका है:
1. मरीजों का गर्मजोशी से स्वागत करना
2. चरण-दर-चरण लक्षण जानकारी एकत्र करना
3. गंभीरता का आकलन करना और प्रारंभिक मार्गदर्शन देना
4. अपॉइंटमेंट बुकिंग में मदद करना
5. मेडिकल रिपोर्ट सरल भाषा में समझाना

महत्वपूर्ण नियम:
- कभी भी निदान या दवा न बताएं
- हमेशा जोड़ें: "यह AI मार्गदर्शन है — कृपया डॉक्टर से मिलें"
- सीने में दर्द, स्ट्रोक के लिए तुरंत कहें: "आपातकाल: अभी Emergency में जाएं या 112 पर कॉल करें"
"""


# ── Rule-based fallback responses ─────────────────────────────
FALLBACK_RESPONSES_EN = {
    "greeting":    "Hello! I'm MediBot, your health assistant. How can I help you today? Please describe your symptoms or ask about our hospital services.",
    "booking":     "To book an appointment:\n• Go to **Book Appointment** in the left menu\n• Select your preferred doctor and specialty\n• Choose an available time slot\n• Confirm your booking\n\nWould you like me to suggest a specialist based on your symptoms?",
    "report":      "I can help explain your medical report. Please share the report name or specific values (like test results, numbers) and I'll break it down in simple language for you.",
    "emergency":   "🚨 **EMERGENCY ALERT**\n\nYour symptoms may require immediate medical attention.\n\n**Please go to the Emergency Department NOW or call 112 immediately.**\n\nDo not wait or drive yourself — call for help.",
    "default":     "I understand your concern. Could you please describe your symptoms in more detail? For example:\n• What symptoms are you experiencing?\n• How long have you had them?\n• How would you rate the severity (1-10)?",
}

FALLBACK_RESPONSES_HI = {
    "greeting":    "नमस्ते! मैं मेडीबॉट हूं। आप कैसे हैं? अपने लक्षण बताएं या अस्पताल सेवाओं के बारे में पूछें।",
    "booking":     "अपॉइंटमेंट बुक करने के लिए:\n• बाईं मेनू में **अपॉइंटमेंट बुक** पर जाएं\n• डॉक्टर और समय चुनें\n• बुकिंग की पुष्टि करें",
    "report":      "मैं आपकी रिपोर्ट सरल भाषा में समझाने में मदद करूंगा। रिपोर्ट का नाम या मुख्य मान बताएं।",
    "emergency":   "🚨 **आपातकाल!**\n\nआपके लक्षण गंभीर हो सकते हैं। **अभी Emergency Department जाएं या 112 पर कॉल करें।**",
    "default":     "मैं समझता हूं। कृपया अपने लक्षण विस्तार से बताएं — कब से हैं, कितने तेज़ हैं?",
}


def get_fallback_response(message: str, lang: str = "en") -> ChatResponse:
    """Keyword-based rule engine for demo mode."""
    msg_lower = message.lower()
    responses = FALLBACK_RESPONSES_EN if lang == "en" else FALLBACK_RESPONSES_HI

    # Check for emergency symptoms
    emergency_keywords = ["chest pain", "heart attack", "stroke", "can't breathe", "unconscious",
                          "सीने में दर्द", "दिल का दौरा", "स्ट्रोक", "सांस नहीं"]
    if any(kw in msg_lower for kw in emergency_keywords):
        return ChatResponse(reply=responses["emergency"], severity="CRITICAL", action="goto_emergency")

    # Booking intent
    if any(kw in msg_lower for kw in ["book", "appointment", "schedule", "doctor", "अपॉइंटमेंट", "बुक"]):
        return ChatResponse(reply=responses["booking"], action="goto_booking")

    # Report intent
    if any(kw in msg_lower for kw in ["report", "result", "lab", "test", "रिपोर्ट", "जांच"]):
        return ChatResponse(reply=responses["report"])

    # Greeting
    if any(kw in msg_lower for kw in ["hi", "hello", "hey", "good morning", "नमस्ते", "हेलो"]):
        return ChatResponse(reply=responses["greeting"])

    # Symptom analysis
    result = compute_severity_score([message])
    if result["score"] > 0:
        severity = result["severity"]
        rec_map = {
            "CRITICAL": "🚨 Your symptoms appear **CRITICAL**. Please go to the Emergency Department immediately.\n\n⚕️ *This is AI guidance — always consult a medical professional.*",
            "HIGH":     f"⚠️ Your symptoms appear **HIGH PRIORITY** (category: {result['category']}).\n\nI recommend seeing a doctor urgently within a few hours.\n\n📅 Use **Book Appointment** to schedule an urgent visit.\n\n⚕️ *This is AI guidance — not a substitute for professional medical advice.*",
            "MEDIUM":   f"🟡 Your symptoms appear **MODERATE** (category: {result['category']}).\n\nConsider seeing a doctor within 1-2 days.\n\n📅 Use **Book Appointment** to schedule a visit.\n\n⚕️ *AI guidance only — please consult a doctor.*",
            "LOW":      f"✅ Your symptoms appear **NON-URGENT** (category: {result['category']}).\n\nRest, hydration, and OTC medication may help. Monitor for 3-4 days.\n\nSee a doctor if symptoms worsen.\n\n⚕️ *AI guidance only — please consult a doctor if unsure.*",
        }
        return ChatResponse(
            reply=rec_map.get(severity, responses["default"]),
            severity=severity,
        )

    return ChatResponse(reply=responses["default"])


async def get_ai_response(request: ChatRequest) -> ChatResponse:
    """
    Main chatbot entry point.
    Uses Google Gemini 2.5 if GEMINI_API_KEY is set,
    otherwise falls back to the built-in rule-based engine.
    """
    last_user_msg = ""
    for m in reversed(request.messages):
        if m.role == "user":
            last_user_msg = m.content
            break

    # ── Google Gemini 2.5 ────────────────────────────────────
    if settings.GEMINI_API_KEY:
        try:
            import google.generativeai as genai

            genai.configure(api_key=settings.GEMINI_API_KEY)

            system = SYSTEM_PROMPT_EN if request.language == "en" else SYSTEM_PROMPT_HI

            # Build Gemini conversation history
            # Gemini uses role "user" and "model" (not "assistant")
            history = []
            for m in request.messages[:-1]:  # all except the last message
                gemini_role = "model" if m.role in ("assistant", "bot") else "user"
                history.append({"role": gemini_role, "parts": [m.content]})

            model = genai.GenerativeModel(
                model_name="gemini-2.5-pro",
                system_instruction=system,
                generation_config=genai.GenerationConfig(
                    max_output_tokens=600,
                    temperature=0.7,
                ),
            )

            chat = model.start_chat(history=history)
            response = await chat.send_message_async(last_user_msg)
            reply = response.text

            # Detect severity from reply text
            reply_upper = reply.upper()
            if "EMERGENCY" in reply_upper or "CRITICAL" in reply_upper or "CALL 112" in reply_upper:
                severity = "CRITICAL"
            elif "URGENT" in reply_upper or "HIGH PRIORITY" in reply_upper:
                severity = "HIGH"
            else:
                severity = None

            return ChatResponse(reply=reply, severity=severity)

        except Exception as e:
            logger.warning(f"Gemini API call failed, falling back to rule engine: {e}")

    # ── Rule-based fallback (no API key needed) ───────────────
    return get_fallback_response(last_user_msg, request.language)
