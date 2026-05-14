import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import Chatbot from '@/components/chatbot/Chatbot';

export default function ChatbotPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="w-7 h-7 text-primary-400" /> AI Health Assistant
        </h1>
        <p className="text-gray-500 mt-1">Ask about symptoms, book appointments, or get health guidance</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
        <Chatbot />
      </motion.div>
    </div>
  );
}
