import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, RefreshCw, Globe, AlertTriangle, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CHATBOT_GREETING, SYMPTOMS_LIST } from '@/data/dummyData';

// ── Rule-based AI engine (runs in-browser for demo) ──────────
const SYMPTOM_RULES = [
  { keywords: ['chest pain','heart','palpitation','shortness of breath','breathing'], severity: 'CRITICAL', advice: 'These symptoms may indicate a cardiac emergency. Please visit the Emergency Department immediately or call 112.' },
  { keywords: ['stroke','slurred speech','face drooping','arm weak','sudden headache'], severity: 'CRITICAL', advice: 'These may be stroke symptoms. Call 112 immediately — time is critical.' },
  { keywords: ['high fever','103','104','105','seizure','unconscious'], severity: 'HIGH', advice: 'High fever or loss of consciousness requires urgent medical attention. Please visit Emergency or book an urgent appointment.' },
  { keywords: ['fever','vomiting','diarrhea','nausea','abdominal pain','stomach'], severity: 'MEDIUM', advice: 'Your symptoms suggest a gastrointestinal or viral infection. I recommend consulting a doctor within 24 hours.' },
  { keywords: ['headache','migraine','dizziness','vertigo','tired','fatigue'], severity: 'MEDIUM', advice: 'These symptoms can have various causes. Rest, hydration, and a doctor consultation within 1-2 days is recommended.' },
  { keywords: ['cold','cough','runny nose','sore throat','sneeze','mild'], severity: 'LOW', advice: 'This sounds like a mild upper respiratory infection. Rest, fluids, and OTC medication may help. See a doctor if symptoms worsen.' },
  { keywords: ['appointment','book','schedule','doctor','available'], severity: null, advice: 'I can help you book an appointment! You can use the **Book Appointment** section in the navigation menu, or tell me your preferred specialty and I\'ll suggest available doctors.' },
  { keywords: ['report','result','lab','blood test','scan'], severity: null, advice: 'I can help explain your medical reports in simple language. Please share the report name or key values and I\'ll break it down for you.' },
];

function analyzeSymptoms(text) {
  const lower = text.toLowerCase();
  for (const rule of SYMPTOM_RULES) {
    if (rule.keywords.some(k => lower.includes(k))) return rule;
  }
  return null;
}

function generateResponse(message, lang) {
  const rule = analyzeSymptoms(message);

  if (!rule) {
    return lang === 'hi'
      ? 'मैं आपकी बात समझ गया। क्या आप अपने लक्षणों के बारे में और विवरण दे सकते हैं? जैसे कब से है, कितना तेज़ है?\n\n*⚕️ यह AI सुझाव है — कृपया चिकित्सीय निर्णय के लिए डॉक्टर से मिलें।*'
      : 'I understand. Could you describe your symptoms in more detail? For example: when did they start, how severe are they (1-10), and any other symptoms?\n\n*⚕️ This is AI guidance only — always consult a doctor for medical decisions.*';
  }

  const severityLabels = { CRITICAL: '🚨 CRITICAL', HIGH: '⚠️ HIGH PRIORITY', MEDIUM: '🟡 MODERATE', LOW: '🟢 LOW PRIORITY', null: 'ℹ️ INFO' };
  const label = severityLabels[rule.severity] || '🤖';

  return `**${label}**\n\n${rule.advice}\n\n${
    rule.severity === 'CRITICAL'
      ? '🏥 **Please do not delay — go to the nearest emergency room now.**'
      : rule.severity === 'HIGH'
      ? '📅 I recommend booking an **urgent appointment** using the Book Appointment section.'
      : rule.severity === 'MEDIUM'
      ? '📋 You can book a regular appointment. Use the navigation menu to schedule one.'
      : rule.severity === 'LOW'
      ? '💊 Consider rest and OTC medication. Monitor symptoms for 2-3 days.'
      : ''
  }\n\n*⚕️ This information is for guidance only and does not replace professional medical advice.*`;
}

// ── Message renderer ─────────────────────────────────────────
function MessageBubble({ msg }) {
  const isBot = msg.role === 'bot';

  // Simple markdown renderer
  const renderContent = (text) =>
    text.split('\n').map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const italic = bold.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return <p key={i} className={`${i > 0 ? 'mt-1' : ''} leading-relaxed`} dangerouslySetInnerHTML={{ __html: italic }} />;
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-white ${
        isBot ? 'bg-gradient-to-br from-primary-500 to-cyan-500 shadow-glow' : 'bg-dark-500'
      }`}>
        {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isBot
          ? 'bg-dark-600/80 border border-white/8 text-gray-200'
          : 'bg-primary-500/90 text-white ml-auto'
      } ${isBot && msg.severity === 'CRITICAL' ? 'border-emergency-500/50 bg-emergency-500/10' : ''}`}>
        {renderContent(msg.content)}
        <span className="text-xs opacity-40 mt-2 block">{msg.time}</span>
      </div>
    </motion.div>
  );
}

// ── Quick replies ────────────────────────────────────────────
const QUICK_REPLIES = {
  en: ['I have chest pain', 'I have a fever', 'Book appointment', 'Explain my report', 'Emergency help', 'Show available doctors'],
  hi: ['सीने में दर्द है', 'बुखार है', 'अपॉइंटमेंट बुक करें', 'रिपोर्ट समझाएं', 'आपातकाल सहायता', 'उपलब्ध डॉक्टर दिखाएं'],
};

export default function Chatbot({ floating = false }) {
  const { language } = useApp();
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', content: CHATBOT_GREETING[language] || CHATBOT_GREETING.en, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text, time }]);
    setInput('');
    setLoading(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));

    const response = generateResponse(text, language);
    const rule     = analyzeSymptoms(text);

    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      role: 'bot',
      content: response,
      severity: rule?.severity,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setLoading(false);
  };

  const reset = () => {
    setMessages([{
      id: Date.now(), role: 'bot',
      content: CHATBOT_GREETING[language] || CHATBOT_GREETING.en,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <div className={`flex flex-col ${floating ? 'h-[520px]' : 'h-full min-h-[600px]'} bg-dark-700/50 rounded-2xl border border-white/8 overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/8 bg-dark-700/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-glow">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">MediBot AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="dot-online" />
              <span className="text-xs text-gray-500">Always available</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600 bg-dark-600 px-2 py-1 rounded-lg font-mono uppercase">
            {language === 'hi' ? 'HI' : 'EN'}
          </span>
          <button onClick={reset} className="btn-ghost p-2" title="Reset chat">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hidden">
        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-dark-600/80 border border-white/8 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                {[0, 0.2, 0.4].map((d, i) => (
                  <motion.span key={i} className="w-1.5 h-1.5 bg-primary-400 rounded-full"
                    animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, delay: d, duration: 0.6 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hidden">
        {QUICK_REPLIES[language].slice(0, 4).map(r => (
          <button
            key={r}
            onClick={() => sendMessage(r)}
            disabled={loading}
            className="flex-shrink-0 text-xs bg-dark-600/80 border border-white/10 hover:border-primary-500/40 text-gray-400 hover:text-primary-400 px-3 py-1.5 rounded-full transition-all whitespace-nowrap disabled:opacity-50"
          >
            {r}
          </button>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="px-4 pb-2">
        <p className="text-xs text-gray-600 text-center">
          ⚕️ AI guidance only — not a substitute for professional medical advice
        </p>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/8 bg-dark-700/80">
        <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={language === 'hi' ? 'अपने लक्षण बताएं...' : 'Describe your symptoms or ask a question...'}
            disabled={loading}
            className="input-field flex-1 py-2.5 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary px-4 py-2.5"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
