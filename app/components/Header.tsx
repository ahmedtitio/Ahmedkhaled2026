import { Moon, Sun, Languages } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 dark:bg-black/10 border-b border-white/20"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg overflow-hidden">
              <ImageWithFallback
                src="https://github.com/ahmedtitio/ahmedtitio.github.io/blob/main/logo.png?raw=true"
                alt="Ahmed Khaled"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-gray-900 dark:text-white">
                {t('أحمد خالد', 'Ahmed Khaled')}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('مطور ويب', 'Web Developer')}
              </span>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-3 rounded-full backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/20 hover:bg-white/30 dark:hover:bg-black/30 transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </motion.button> */}

            {/* Language Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLanguage}
              className="p-3 rounded-full backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/20 hover:bg-white/30 dark:hover:bg-black/30 transition-all flex items-center gap-2"
              aria-label="Toggle language"
            >
              <Languages className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {language === 'ar' ? 'EN' : 'ع'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}