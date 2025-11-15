import { useLanguage } from '../contexts/LanguageContext';
import { skills } from '../data/skills';
import { motion } from 'motion/react';
import { Code, Server, Wrench, Palette } from 'lucide-react';

export function SkillsSection() {
  const { t } = useLanguage();

  const categories = {
    frontend: { icon: Code, label: { ar: 'تطوير الواجهات', en: 'Frontend' }, color: 'from-blue-500 to-cyan-500' },
    backend: { icon: Server, label: { ar: 'تطوير الخادم', en: 'Backend' }, color: 'from-purple-500 to-pink-500' },
    tools: { icon: Wrench, label: { ar: 'أدوات التطوير', en: 'Tools' }, color: 'from-orange-500 to-red-500' },
    design: { icon: Palette, label: { ar: 'التصميم والإبداع', en: 'Design' }, color: 'from-green-500 to-teal-500' }
  };

  const groupedSkills = {
    frontend: skills.filter(s => s.category === 'frontend'),
    backend: skills.filter(s => s.category === 'backend'),
    tools: skills.filter(s => s.category === 'tools'),
    design: skills.filter(s => s.category === 'design')
  };

  return (
    <section id="skills" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 text-gray-900 dark:text-white">
            {t('المهارات والخبرات', 'Skills & Expertise')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('التقنيات والأدوات التي أتقنها', 'Technologies and tools I master')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => {
            const { icon: Icon, label, color } = categories[category as keyof typeof categories];
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-3xl p-8 border border-white/20 shadow-xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl text-gray-900 dark:text-white">
                    {t(label.ar, label.en)}
                  </h3>
                </div>

                <div className="space-y-4">
                  {categorySkills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-800 dark:text-gray-200">
                          {skill.name}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {skill.percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: index * 0.05 }}
                          className={`h-full bg-gradient-to-r ${color} rounded-full`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
