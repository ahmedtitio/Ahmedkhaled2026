"use client";
import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
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

export default function App() {
  const [showAllProjects, setShowAllProjects] = useState(false);

  if (showAllProjects) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <SiteProtection />
          <AllProjectsPage onClose={() => setShowAllProjects(false)} />
          <Toaster position="top-center" richColors />
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <SiteProtection />
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
      </LanguageProvider>
    </ThemeProvider>
  );
}