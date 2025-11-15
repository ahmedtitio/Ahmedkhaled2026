import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Code2, Sparkles } from 'lucide-react';

export function HeroSection() {
  const { t, language } = useLanguage();
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = language === 'ar' 
    ? [
        'مرحباً، أنا أحمد خالد 👋',
        'مطور ويب متخصص 💻',
        'خبير في React و Next.js ⚛️',
        'مصمم واجهات مستخدم 🎨',
        'مطور Full Stack 🚀'
      ]
    : [
        'Hello, I\'m Ahmed Khaled 👋',
        'Specialized Web Developer 💻',
        'Expert in React & Next.js ⚛️',
        'UI/UX Designer 🎨',
        'Full Stack Developer 🚀'
      ];

  const [textArrayIndex, setTextArrayIndex] = useState(0);

  useEffect(() => {
    const currentFullText = texts[textArrayIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (currentIndex < currentFullText.length) {
          setTypedText(currentFullText.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (currentIndex > 0) {
          setTypedText(currentFullText.substring(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        } else {
          setIsDeleting(false);
          setTextArrayIndex((textArrayIndex + 1) % texts.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentIndex, isDeleting, textArrayIndex, texts]);

  const description = {
    ar: 'أقوم بتحويل الأفكار إلى تجارب رقمية مذهلة. متخصص في تطوير تطبيقات الويب الحديثة باستخدام أحدث التقنيات والأدوات. أجمع بين البرمجة والتصميم لإنشاء حلول مبتكرة تلبي احتياجات العملاء.',
    en: 'I transform ideas into amazing digital experiences. Specialized in developing modern web applications using the latest technologies and tools. I combine programming and design to create innovative solutions that meet client needs.'
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {t('مرحباً بك في موقعي', 'Welcome to my Portfolio')}
              </span>
            </div>

            {/* Typing Animation */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl mb-6 min-h-[80px] md:min-h-[120px] text-gray-900 dark:text-white">
              {typedText}
              <span className="animate-blink">|</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
            >
              {language === 'ar' ? description.ar : description.en}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#projects"
                className="group px-8 py-4 rounded-full backdrop-blur-md bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Code2 className="w-5 h-5" />
                <span>{t('استكشف أعمالي', 'Explore My Work')}</span>
              </a>
              <a
                href="#contact"
                className="px-8 py-4 rounded-full backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/20 hover:bg-white/30 dark:hover:bg-black/30 transition-all text-gray-900 dark:text-white"
              >
                {t('تواصل معي', 'Contact Me')}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
