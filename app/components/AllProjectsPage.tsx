"use client";
import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { projects } from '../data/projects';
import { motion } from 'motion/react';
import { ArrowLeft, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectViewer } from './ProjectViewer';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Header } from './Header';
import { Footer } from './Footer';

interface AllProjectsPageProps {
  onClose: () => void;
}

const PROJECTS_PER_PAGE = 15;

export function AllProjectsPage({ onClose }: AllProjectsPageProps) {
  const { t, language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-300">
      <Header />
      
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onClose}
            className="mb-8 flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-md bg-white/20 dark:bg-black/20 border border-white/20 hover:bg-white/30 dark:hover:bg-black/30 transition-all text-gray-900 dark:text-white"
          >
            <ArrowLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
            <span>{t('العودة للرئيسية', 'Back to Home')}</span>
          </motion.button>

          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl mb-4 text-gray-900 dark:text-white">
              {t('جميع المشاريع', 'All Projects')}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t(`إجمالي ${projects.length} مشروع`, `Total ${projects.length} projects`)}
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {currentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ y: -10 }}
                className="group backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-3xl overflow-hidden border border-white/20 shadow-xl cursor-pointer"
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="relative overflow-hidden aspect-video">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title[language]}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <div className="flex items-center gap-2 text-white">
                      <ExternalLink className="w-5 h-5" />
                      <span>{t('عرض المشروع', 'View Project')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl mb-3 text-gray-900 dark:text-white">
                    {project.title[language]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {project.description[language]}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-white/20 dark:bg-black/20 text-sm text-gray-700 dark:text-gray-300 border border-white/10"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 rounded-full bg-white/20 dark:bg-black/20 text-sm text-gray-700 dark:text-gray-300 border border-white/10">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2"
            >
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all ${
                  currentPage === 1
                    ? 'bg-white/5 dark:bg-black/5 text-gray-400 cursor-not-allowed'
                    : 'bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 text-gray-900 dark:text-white'
                }`}
              >
                <ChevronRight className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/20 transition-all ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 text-gray-900 dark:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-3 rounded-full backdrop-blur-md border border-white/20 transition-all ${
                  currentPage === totalPages
                    ? 'bg-white/5 dark:bg-black/5 text-gray-400 cursor-not-allowed'
                    : 'bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 text-gray-900 dark:text-white'
                }`}
              >
                <ChevronLeft className={`w-5 h-5 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />

      {selectedProject && (
        <ProjectViewer
          project={projects.find(p => p.id === selectedProject)!}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
