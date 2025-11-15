import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Project } from '../types';
import * as ProjectComponents from './projects';

interface ProjectViewerProps {
  project: Project;
  onClose: () => void;
}

export function ProjectViewer({ project, onClose }: ProjectViewerProps) {
  const { t, language } = useLanguage();
  const backButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // إدارة الأحداث الخاصة بزر العودة
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // ضمان ظهور زر العودة فوق جميع الطبقات
    const ensureButtonVisibility = () => {
      if (backButtonRef.current) {
        backButtonRef.current.style.zIndex = '2147483647'; // أعلى قيمة ممكنة
        backButtonRef.current.style.position = 'fixed';
      }
    };

    // تشغيل عند التحميل الأولي
    ensureButtonVisibility();
    
    // التحقق الدوري لضمان بقاء الزر في المقدمة
    const visibilityInterval = setInterval(ensureButtonVisibility, 100);
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleGlobalKeyDown);
      clearInterval(visibilityInterval);
    };
  }, [onClose]);

  // Get the project component dynamically
  const ProjectComponent = ProjectComponents[project.component as keyof typeof ProjectComponents];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="backdrop-blur-md bg-white/10 border-b border-white/20 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <h3 className="text-xl text-white mb-1">
                {project.title[language]}
              </h3>
              <p className="text-sm text-gray-300">
                {project.description[language]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Project Content */}
        <div className="flex-1 overflow-auto bg-white">
          {ProjectComponent ? <ProjectComponent /> : <div className="p-8">Project not found</div>}
        </div>
      </motion.div>

      {/* زر العودة للرئيسية - طبقة عليا جداً */}
      <motion.button
        ref={backButtonRef}
        initial={{ 
          x: language === 'ar' ? 100 : -100,
          opacity: 0
        }}
        animate={{ 
          x: 0,
          opacity: 1,
          transition: { delay: 0.3 }
        }}
        exit={{ 
          x: language === 'ar' ? 100 : -100,
          opacity: 0 
        }}
        onClick={(e) => {
          e.stopPropagation(); // منع انتشار الحدث
          e.preventDefault(); // منع السلوك الافتراضي
          onClose();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className={`fixed bottom-8 ${language === 'ar' ? 'left-8' : 'right-8'} 
          p-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 
          text-white shadow-2xl hover:shadow-3xl transition-all flex items-center gap-2
          z-[2147483647]`} // أعلى قيمة ممكنة لـ z-index
        aria-label={t('العودة للرئيسية', 'Back to Home')}
        style={{
          willChange: 'transform, opacity',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          pointerEvents: 'auto !important',
          userSelect: 'none'
        }}
      >
        <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
        <span className="font-medium whitespace-nowrap">
          {t('العودة للرئيسية', 'Back to Home')}
        </span>
      </motion.button>
    </motion.div>
  );
}