'use client';
import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SiteDataProvider, SiteDataValue } from './contexts/SiteDataContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SocialSection } from './components/SocialSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { AllProjectsPage } from './components/AllProjectsPage';
import { SiteProtection } from './components/SiteProtection';
import { Toaster } from './components/ui/sonner';

interface HomeShellProps extends SiteDataValue {}

/**
 * غلاف الواجهة الرئيسية — يستقبل البيانات من قاعدة البيانات (عبر page.tsx)
 * ويوفرها لبقية المكوّنات عبر SiteDataContext.
 */
export default function HomeShell({ projects, skills, settings }: HomeShellProps) {
  const [showAllProjects, setShowAllProjects] = useState(false);

  // وضع الصيانة: إذا فعّله الأدمن تظهر صفحة صيانة بدل الموقع
  if (settings['maintenanceMode'] === 'true' || settings['maintenance_mode'] === 'true') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🚧</div>
          <h1 className="text-3xl font-bold mb-4">
            {settings['maintenance_message'] || 'الموقع قيد الصيانة حاليًا'}
          </h1>
          <p className="text-gray-400">
            {settings['maintenance_message_en'] || 'The site is currently under maintenance. Please check back soon.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SiteDataProvider value={{ projects, skills, settings }}>
          <SiteProtection />
          {showAllProjects ? (
            <>
              <AllProjectsPage onClose={() => setShowAllProjects(false)} />
              <Toaster position="top-center" richColors />
            </>
          ) : (
            <>
              <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-300">
                <Header />
                <main>
                  <HeroSection />
                  <SkillsSection />
                  <ProjectsSection onViewAll={() => setShowAllProjects(true)} />
                  <SocialSection />
                </main>
                <Footer />
                <WhatsAppButton />
              </div>
              <Toaster position="top-center" richColors />
            </>
          )}
        </SiteDataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
