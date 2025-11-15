import { useLanguage } from '../contexts/LanguageContext';
import { Heart } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 backdrop-blur-md bg-white/10 dark:bg-black/10 border-t border-white/20">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2 flex-wrap">
            <span>{t('© جميع الحقوق محفوظة', '© All rights reserved')}</span>
            <span>•</span>
            <span>{currentYear}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              {t('صُنع بـ', 'Made with')}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              {t('بواسطة أحمد خالد', 'by Ahmed Khaled')}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
