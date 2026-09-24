import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function WhatsAppButton() {
  const { language } = useLanguage();
  const phoneNumber = '201017452932'; // رقم الواتساب (بدون + أو 00)
  const message = language === 'ar' 
    ? 'مرحباً، أود التواصل معك بخصوص...'
    : 'Hello, I would like to contact you about...';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed bottom-8 ${language === 'ar' ? 'right-8' : 'left-8'} z-50 w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl flex items-center justify-center group hover:shadow-green-500/50 transition-all`}
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-8 h-8 text-white group-hover:animate-pulse" />
      
      {/* Pulse Animation */}
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
    </motion.a>
  );
}
