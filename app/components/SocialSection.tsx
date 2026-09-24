import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'motion/react';
import { Facebook, Linkedin, Mail, Twitter, Globe, Instagram } from 'lucide-react';

export function SocialSection() {
  const { t } = useLanguage();

  const socials = [
    {
      icon: Facebook,
      label: 'Facebook',
      href: 'https://www.facebook.com/ahmd.al.almy.407135/',
      color: 'from-blue-500 to-blue-700'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: 'https://linkedin.com/in/',
      color: 'from-blue-600 to-blue-800'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://x.com/shortcutclick',
      color: 'from-sky-400 to-sky-600'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      href: 'https://www.instagram.com/ahmedalalamy2021/',
      color: 'from-pink-500 to-purple-600'
    },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:ah01110692728@gmail.com',
      color: 'from-red-500 to-orange-600'
    },
    {
      icon: Globe,
      label: t('الموقع الشخصي', 'Website'),
      href: '/',
      color: 'from-green-500 to-teal-600'
    }
  ];

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 text-gray-900 dark:text-white">
            {t('تواصل معي', 'Get In Touch')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t('دعنا نبني شيئاً رائعاً معاً', 'Let\'s build something amazing together')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {socials.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all group"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${social.color} flex items-center justify-center transform group-hover:rotate-12 transition-transform`}>
                  <social.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-center text-gray-900 dark:text-white">
                  {social.label}
                </p>
              </motion.a>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 text-center backdrop-blur-md bg-white/10 dark:bg-black/10 rounded-3xl p-8 border border-white/20"
          >
            <h3 className="text-2xl mb-4 text-gray-900 dark:text-white">
              {t('هل لديك مشروع في ذهنك؟', 'Have a project in mind?')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('أنا متاح دائماً للفرص الجديدة والتعاون المثمر', 'I\'m always open to new opportunities and productive collaborations')}
            </p>
            <a
              href="mailto:ah01110692728@gmail.com"
              className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              {t('أرسل رسالة', 'Send Message')}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}