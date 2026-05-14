import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col items-center justify-center z-50">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-glow-lg mb-6"
      >
        <Heart className="w-8 h-8 text-white" fill="white" />
      </motion.div>
      <p className="text-gray-400 text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
}
