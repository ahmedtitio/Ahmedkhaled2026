import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { projects } from '../data/projects';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { ProjectViewer } from './ProjectViewer';
import { ImageWithFallback } from './figma/ImageWithFallback';

const MAX_PROJECTS_TO_SHOW = 6;

interface ProjectsSectionProps {
  onViewAll?: () => void;
}

export function ProjectsSection({ onViewAll }: ProjectsSectionProps) {
  const { t, language } = useLanguage();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const displayedProjects = projects.slice(0, MAX_PROJECTS_TO_SHOW);
  const hasMoreProjects = projects.length > MAX_PROJECTS_TO_SHOW;

  return (
    <>
      <section id="projects" className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4 text-gray-900 dark:text-white">
              {t('المشاريع السابقة', 'Portfolio Projects')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {t('مجموعة من أعمالي المميزة', 'A collection of my featured work')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {displayedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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

          {/* View All Projects Button */}
          {hasMoreProjects && onViewAll && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center mt-12"
            >
              <button
                onClick={onViewAll}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
              >
                <span>{t('عرض جميع المشاريع', 'View All Projects')}</span>
                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${language === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectViewer
            project={projects.find(p => p.id === selectedProject)!}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}