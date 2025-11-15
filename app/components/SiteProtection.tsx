import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

export function SiteProtection() {
  const { t } = useLanguage();

  useEffect(() => {
    // منع النسخ
    const preventCopy = (e: Event) => {
      e.preventDefault();
      showWarning(t('النسخ', 'Copy'), t('النسخ من الموقع محظور', 'Copying from the site is prohibited'));
      return false;
    };

    // منع النقر بالزر الأيمن
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showWarning(
        t('قائمة السياق', 'Context Menu'),
        t('قائمة النقر بالزر الأيمن محظورة', 'Right-click menu is prohibited')
      );
      return false;
    };

    // منع السحب
    const preventDrag = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // منع التحديد
    const preventSelection = (e: Event) => {
      if (window.getSelection()?.toString().length ?? 0 > 0) {
        window.getSelection()?.removeAllRanges();
      }
    };

    // دالة لإظهار التحذير
    const showWarning = (feature: string, message: string) => {
      toast.error(`🚫 ${feature}`, {
        description: message,
        duration: 3000,
        style: {
          background: '#dc2626',
          color: 'white',
          border: '2px solid #991b1b',
          fontSize: '16px',
        },
      });
    };

    // منع اختصارات لوحة المفاتيح
    const preventKeyboardShortcuts = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const keyCode = e.keyCode || e.which;

      // منع أزرار F (F1-F12)
      if (keyCode >= 112 && keyCode <= 123) {
        e.preventDefault();
        const fKeyNumber = keyCode - 111;
        showWarning(
          `F${fKeyNumber}`,
          t(`زر F${fKeyNumber} محظور`, `F${fKeyNumber} key is prohibited`)
        );
        return false;
      }

      // منع Ctrl/Cmd + مفاتيح معينة
      if (e.ctrlKey || e.metaKey) {
        // منع Ctrl+C (نسخ)
        if (key === 'c') {
          e.preventDefault();
          showWarning(
            t('نسخ (Ctrl+C)', 'Copy (Ctrl+C)'),
            t('النسخ محظور', 'Copying is prohibited')
          );
          return false;
        }
        
        // منع Ctrl+X (قص)
        if (key === 'x') {
          e.preventDefault();
          showWarning(
            t('قص (Ctrl+X)', 'Cut (Ctrl+X)'),
            t('القص محظور', 'Cutting is prohibited')
          );
          return false;
        }
        
        // منع Ctrl+V (لصق)
        if (key === 'v') {
          e.preventDefault();
          showWarning(
            t('لصق (Ctrl+V)', 'Paste (Ctrl+V)'),
            t('اللصق محظور', 'Pasting is prohibited')
          );
          return false;
        }
        
        // منع Ctrl+U (عرض المصدر)
        if (key === 'u') {
          e.preventDefault();
          showWarning(
            t('عرض المصدر (Ctrl+U)', 'View Source (Ctrl+U)'),
            t('عرض كود المصدر محظور', 'Viewing source code is prohibited')
          );
          return false;
        }
        
        // منع Ctrl+S (حفظ)
        if (key === 's') {
          e.preventDefault();
          showWarning(
            t('حفظ الصفحة (Ctrl+S)', 'Save Page (Ctrl+S)'),
            t('حفظ الصفحة محظور', 'Saving the page is prohibited')
          );
          return false;
        }
        
        // منع Ctrl+P (طباعة)
        if (key === 'p') {
          e.preventDefault();
          showWarning(
            t('طباعة (Ctrl+P)', 'Print (Ctrl+P)'),
            t('الطباعة محظورة', 'Printing is prohibited')
          );
          return false;
        }

        // منع Ctrl+A (تحديد الكل)
        if (key === 'a') {
          e.preventDefault();
          showWarning(
            t('تحديد الكل (Ctrl+A)', 'Select All (Ctrl+A)'),
            t('تحديد الكل محظور', 'Select all is prohibited')
          );
          return false;
        }

        // منع Ctrl+F (بحث)
        if (key === 'f') {
          e.preventDefault();
          showWarning(
            t('البحث (Ctrl+F)', 'Find (Ctrl+F)'),
            t('البحث في الصفحة محظور', 'Find in page is prohibited')
          );
          return false;
        }

        // منع Ctrl+Shift+I أو Ctrl+Shift+J أو Ctrl+Shift+C (أدوات المطور)
        if (e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) {
          e.preventDefault();
          showWarning(
            t('أدوات المطور', 'Developer Tools'),
            t('فتح أدوات المطور محظور', 'Opening developer tools is prohibited')
          );
          return false;
        }
      }

      // منع Ctrl بمفرده
      if (e.ctrlKey && !e.shiftKey && !e.altKey && key === 'control') {
        showWarning(
          t('زر Ctrl', 'Ctrl Key'),
          t('استخدام زر Ctrl محظور', 'Using Ctrl key is prohibited')
        );
      }

      // منع Shift بمفرده
      if (e.shiftKey && !e.ctrlKey && !e.altKey && key === 'shift') {
        showWarning(
          t('زر Shift', 'Shift Key'),
          t('استخدام زر Shift محظور', 'Using Shift key is prohibited')
        );
      }

      // منع Alt بمفرده
      if (e.altKey && !e.ctrlKey && !e.shiftKey && key === 'alt') {
        showWarning(
          t('زر Alt', 'Alt Key'),
          t('استخدام زر Alt محظور', 'Using Alt key is prohibited')
        );
      }

      // منع حرف I بمفرده
      if (key === 'i' && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        showWarning(
          t('حرف I', 'Letter I'),
          t('حرف I محظور', 'Letter I is prohibited')
        );
        return false;
      }

      // منع عدسة جوجل (Ctrl+Shift+L في Chrome أو ببساطة منع أي محاولة)
      if (e.ctrlKey && e.shiftKey && key === 'l') {
        e.preventDefault();
        showWarning(
          t('عدسة جوجل', 'Google Lens'),
          t('استخدام عدسة جوجل محظور', 'Using Google Lens is prohibited')
        );
        return false;
      }

      return true;
    };

    // منع أدوات المطور
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        showWarning(
          t('أدوات المطور', 'Developer Tools'),
          t('إغلاق أدوات المطور مطلوب', 'Please close developer tools')
        );
      }
    };

    // إضافة المستمعين
    document.addEventListener('copy', preventCopy);
    document.addEventListener('cut', preventCopy);
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('dragstart', preventDrag);
    document.addEventListener('keydown', preventKeyboardShortcuts);

    // فحص أدوات المطور كل ثانية
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // منع تحديد النص عبر CSS
	document.body.style.userSelect = 'none';
(document.body.style as any).webkitUserSelect = 'none';
(document.body.style as any).msUserSelect = 'none';
(document.body.style as any).mozUserSelect = 'none';


    // إظهار رسالة ترحيبية بالحماية
    setTimeout(() => {
      toast.success(t('🔒 الحماية مفعّلة', '🔒 Protection Enabled'), {
        description: t('الموقع محمي من النسخ والأدوات الخارجية', 'Site is protected from copying and external tools'),
        duration: 2000,
      });
    }, 1000);

    // تنظيف عند إزالة المكون
    return () => {
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('cut', preventCopy);
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('dragstart', preventDrag);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      clearInterval(devToolsInterval);
	  
      document.body.style.userSelect = '';
      document.body.style.removeProperty('-webkit-user-select');
      document.body.style.removeProperty('-ms-user-select');
      document.body.style.removeProperty('-moz-user-select');
    };
  }, [t]);

  return null;
}
