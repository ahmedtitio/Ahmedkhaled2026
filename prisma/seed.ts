/**
 * Seed script — يعبّئ قاعدة البيانات من ملفات البيانات الحالية (app/data)
 * الاستخدام: npx prisma db seed
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ===== نسخ بيانات المشاريع الحالية (من app/data/projects.ts) =====
const projectsData = [
  { id: 1, ar: 'موقع تجارة إلكترونية', en: 'E-Commerce Website', dar: 'منصة تجارة إلكترونية متكاملة مع نظام دفع آمن وإدارة المنتجات', den: 'Full-featured e-commerce platform with secure payment and product management', image: 'https://raw.githubusercontent.com/jgudo/ecommerce-react/master/static/screeny1.png', component: 'Project1', tech: ['React', 'firebase', 'Stripe', 'TypeScript'] },
  { id: 2, ar: 'لوحة تحكم إدارية', en: 'Admin Dashboard', dar: 'لوحة تحكم شاملة لإدارة المحتوى والمستخدمين مع تحليلات متقدمة', den: 'Comprehensive dashboard for content and user management with advanced analytics', image: 'https://user-images.githubusercontent.com/6037466/184547401-1c481008-e013-4ba0-b9a8-3eaf3ff7b9a1.png', component: 'Project2', tech: ['Bootstrap', 'Laravel'] },
  { id: 3, ar: 'تطبيق حجز المواعيد', en: 'Booking Application', dar: 'نظام حجز مواعيد ذكي مع تنبيهات وإدارة التقويم', den: 'Smart appointment booking system with notifications and calendar management', image: 'https://github.com/ahmedtitio/frontend/blob/main/src/assets/7d2f45ee-8fb5-49d3-9637-14077e67cce2_image.png?raw=true', component: 'Project3', tech: ['CSS', 'JavaScript', 'HTML'] },
  { id: 4, ar: 'موقع شركة محاماة', en: 'Law firm website', dar: 'موقع تعريفي احترافي للشركة مع إدارة محتوى سهلة', den: 'professional company profile website with easy content management.', image: 'https://github.com/ahmedtitio/frontend/blob/main/src/assets/d70d26b7-ff33-49eb-9135-0de3a0f7f93d_image.png?raw=true', component: 'Project4', tech: ['React', 'SEO', 'Tailwind', 'Node.js', 'MySQL'] },
  { id: 5, ar: 'مدونة مركز طبي', en: 'Medical Center Blog', dar: 'منصة مركز الرواد الطبي يعمل مدونة تفاعلية مع تقديم استشارات فريدة عن بعد', den: 'The Pioneers Medical Center platform operates an interactive blog offering unique remote consultations.', image: 'https://github.com/ahmedtitio/frontend/blob/main/src/assets/%D8%AA%D9%86%D8%B2%D9%8A%D9%84.png?raw=true', component: 'Project5', tech: ['WordPress', 'SEO', 'Tailwind', 'Elementor', 'PHP', 'MySQL'] },
  { id: 6, ar: 'شركة نعمل معاً للمحاماة والاستشارات القانونية والمالية', en: 'Working Together Law Firm for Legal and Financial Consulting', dar: 'نعمل معا لتحقيق الراحة القصوى للعميل مع محامين ومستشارين محترفون لتقديم الخدمات والاستشارات القانونية بمزيد من الجهد والتميز حتى نقدم لعميلنا الخيار الأفضل', den: 'We work together to achieve maximum client comfort with professional lawyers and consultants to provide legal services and advice with extra effort and excellence so that we can offer our client the best option.', image: 'https://github.com/ahmedtitio/frontend/blob/main/src/assets/content.png?raw=true', component: 'Project6', tech: ['WordPress', 'SEO', 'Elementor', 'PHP', 'MySQL', 'Tailwind'] },
];

// ===== نسخ بيانات المهارات الحالية (من app/data/skills.ts) =====
const skillsData: [string, number, string, string][] = [
  ['HTML5', 95, 'code', 'frontend'],
  ['CSS3', 95, 'palette', 'frontend'],
  ['Bootstrap', 90, 'layout', 'frontend'],
  ['JavaScript', 92, 'code-2', 'frontend'],
  ['React', 88, 'atom', 'frontend'],
  ['Next.js', 85, 'triangle', 'frontend'],
  ['Vue', 80, 'box', 'frontend'],
  ['Node.js', 85, 'server', 'backend'],
  ['PHP', 82, 'database', 'backend'],
  ['Laravel', 85, 'box-select', 'backend'],
  ['WordPress', 90, 'globe', 'backend'],
  ['MySQL', 85, 'database', 'backend'],
  ['PostgreSQL', 80, 'database', 'backend'],
  ['Git', 88, 'git-branch', 'tools'],
  ['Docker', 75, 'package', 'tools'],
  ['Figma', 85, 'figma', 'design'],
  ['Photoshop', 80, 'image', 'design'],
  ['Video Editing', 75, 'video', 'design'],
];

async function main() {
  // 1) إنشاء مستخدم الأدمن الأول من المتغيرات البيئية
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const hashed = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: 'admin',
      password: hashed,
      role: 'ADMIN',
      name: 'Administrator',
    },
  });
  console.log(`✔ Admin user ready: ${admin.email}`);

  // 2) المشاريع (نستورد أول 6 مفصّلة + بقية الـ 20 بعناوين عامة من الملفات الموجودة)
  let count = 0;
  for (const p of projectsData) {
    await prisma.project.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        titleAr: p.ar,
        titleEn: p.en,
        descriptionAr: p.dar,
        descriptionEn: p.den,
        image: p.image,
        component: p.component,
        technologies: JSON.stringify(p.tech),
        order: p.id,
        featured: p.id <= 6,
        published: true,
      },
    });
    count++;
  }

  // المشاريع 7..20 لها مكوّنات ProjectX.tsx جاهزة — نضيفها بتعريف قابل للتعديل من اللوحة
  for (let i = 7; i <= 20; i++) {
    await prisma.project.upsert({
      where: { id: i },
      update: {},
      create: {
        id: i,
        titleAr: `مشروع رقم ${i}`,
        titleEn: `Project ${i}`,
        descriptionAr: 'وصف المشروع — عدّله من لوحة التحكم',
        descriptionEn: 'Project description — edit it from the admin panel',
        image: '',
        component: `Project${i}`,
        technologies: JSON.stringify(['Web']),
        order: i,
        featured: false,
        published: true,
      },
    });
    count++;
  }
  console.log(`✔ Projects seeded: ${count}`);

  // 3) المهارات
  let sCount = 0;
  for (let i = 0; i < skillsData.length; i++) {
    const [name, percentage, icon, category] = skillsData[i];
    const existing = await prisma.skill.findFirst({ where: { name } });
    if (!existing) {
      await prisma.skill.create({
        data: { name, percentage, icon, category, order: i + 1, published: true },
      });
      sCount++;
    }
  }
  console.log(`✔ Skills seeded: ${sCount}`);

  // 4) إعدادات الموقع الافتراضية
  const settings: Record<string, string> = {
    siteTitle: 'أحمد | مطور ويب',
    siteTitleEn: 'Ahmed | Web Developer',
    heroTitleAr: 'أحوّل أفكارك إلى مواقع احترافية',
    heroTitleEn: 'I turn your ideas into professional websites',
    heroSubtitleAr: 'مطور ويب متخصص في بناء المواقع والتطبيقات الحديثة',
    heroSubtitleEn: 'A web developer specialized in modern websites and applications',
    whatsappNumber: '',
    emailContact: 'contact@example.com',
    socialFacebook: '',
    socialGithub: '',
    socialLinkedin: '',
    socialTwitter: '',
    socialInstagram: '',
    maintenanceMode: 'false',
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }
  console.log('✔ Site settings initialized');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
