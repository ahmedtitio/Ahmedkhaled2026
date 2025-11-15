import { Project } from "../types";

export const projects: Project[] = [
  {
    id: 1,
    title: { ar: "موقع تجارة إلكترونية", en: "E-Commerce Website" },
    description: {
      ar: "منصة تجارة إلكترونية متكاملة مع نظام دفع آمن وإدارة المنتجات",
      en: "Full-featured e-commerce platform with secure payment and product management",
    },
    image:
      "https://raw.githubusercontent.com/jgudo/ecommerce-react/master/static/screeny1.png",
    component: "Project1",
    technologies: ["React", "firebase", "Stripe", "TypeScript"],
  },
  {
    id: 2,
    title: { ar: "لوحة تحكم إدارية", en: "Admin Dashboard" },
    description: {
      ar: "لوحة تحكم شاملة لإدارة المحتوى والمستخدمين مع تحليلات متقدمة",
      en: "Comprehensive dashboard for content and user management with advanced analytics",
    },
    image:
      "https://user-images.githubusercontent.com/6037466/184547401-1c481008-e013-4ba0-b9a8-3eaf3ff7b9a1.png",
    component: "Project2",
    technologies: ["Bootstrap", "Laravel"],
  },
  {
    id: 3,
    title: { ar: "تطبيق حجز المواعيد", en: "Booking Application" },
    description: {
      ar: "نظام حجز مواعيد ذكي مع تنبيهات وإدارة التقويم",
      en: "Smart appointment booking system with notifications and calendar management",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/7d2f45ee-8fb5-49d3-9637-14077e67cce2_image.png?raw=true",
    component: "Project3",
    technologies: ["CSS", "JavaScript", "HTML"],
  },
  {
    id: 4,
    title: { ar: "موقع شركة محاماة", en: "Law firm website" },
    description: {
      ar: "موقع تعريفي احترافي للشركة مع إدارة محتوى سهلة",
      en: "professional company profile website with easy content management.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/d70d26b7-ff33-49eb-9135-0de3a0f7f93d_image.png?raw=true",
    component: "Project4",
    technologies: ["React","SEO", "Tailwind", "Node.js", "MySQL"],
  },
  {
    id: 5,
    title: { ar: "مدونة مركز طبي ", en: "Medical Center Blog" },
    description: {
      ar: "منصة مركز الرواد الطبي يعمل مدونة تفاعلية مع تقديم استشارات فريدة عن بعد ",
      en: "The Pioneers Medical Center platform operates an interactive blog offering unique remote consultations.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/%D8%AA%D9%86%D8%B2%D9%8A%D9%84.png?raw=true",
    component: "Project5",
    technologies: ["WordPress", "SEO","Tailwind", "Elementor", "PHP", "MySQL"],
  },
  

  // إضافات جديدة للمجموع 20 مشروع
  {
    id: 6,
    title: { ar: "شركة نعمل معاً للمحاماة والاستشارات القانونية والمالية", en: "Working Together Law Firm for Legal and Financial Consulting" },
    description: {
      ar: "نعمل معا لتحقيق الراحة القصوى للعميل مع محامين ومستشارين محترفون لتقديم الخدمات والاستشارات القانونية بمزيد من الجهد والتميز حتى نقدم لعميلنا الخيار الأفضل",
      en: "We work together to achieve maximum client comfort with professional lawyers and consultants to provide legal services and advice with extra effort and excellence so that we can offer our client the best option.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content.png?raw=true",
    component: "Project6",
    technologies: ["WordPress", "SEO", "Elementor", "PHP", "MySQL","Tailwind"],
  }
  ,
  {
    id: 7,
    title: { ar: "جريدة نادي صوت الإعلام الرقمي", en: "The Digital Media Voice Club Newspaper" },
    description: {
      ar: "منصة جريدة نادي صوت الإعلام الرقمي، يشمل تحسين الواجهة، إدارة المحتوى، وربط النظام بقواعد البيانات لضمان نشر سريع ومنظّم للمقالات",
      en: "The digital media club's newspaper platform includes interface improvements, content management, and linking the system to databases to ensure fast and organized article publishing.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content%20112.png?raw=true",
    component: "Project7",
    technologies: ["WordPress", "SEO", "Elementor", "PHP", "MySQL"],
  },
  {
    id: 8,
    title: { ar: "صحيفة أخبار الوطن", en: "Al-Watan Newspaper" },
    description: {
      ar: "صحيفة أخبار الوطن، يشمل تحسين الواجهة، إدارة المحتوى، وربط النظام بقواعد البيانات لضمان نشر سريع ومنظّم للمقالات",
      en: "Al Watan News newspaper's improvements include interface enhancement, content management, and linking the system to databases to ensure fast and organized article publishing.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content806.png?raw=true",
    component: "Project8",
    technologies: ["WordPress", "SEO", "Elementor", "PHP", "MySQL"],
  },
  {
    id: 9,
    title: { ar: "متجر شركة محمد نور", en: "Mohammed Nour Company Store" },
    description: {
      ar: "شركة محمد نور يشمل تحسين الواجهة، إدارة المحتوى ومتجر جميل وانيق وبسيط",
      en: "Mohammed Nour Company includes interface improvement, content management, and a beautiful, elegant, and simple store.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content%20(1).png?raw=true",
    component: "Project9",
    technologies: ["WordPress","WooCommerce", "SEO", "Elementor", "PHP", "MySQL"],
  },
  {
    id: 10,
    title: { ar: "سوق إلكتروني (Marketplace)", en: "Marketplace Platform" },
    description: {
      ar: "سوق متعدد البائعين مع إدارة الطلبات وشبكة دفع وتقييمات",
      en: "Multi-vendor marketplace with order management, payments and ratings",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content%20(2).png?raw=true",
    component: "Project10",
    technologies: ["WordPress","WooCommerce", "SEO", "Elementor", "PHP", "MySQL"],
  },
  {
    id: 11,
    title: { ar: "شركة البرمجة الحديثة", en: "Modern Programming Company" },
    description: {
      ar: "منصة شركة البرمجة الحديثة موقع تعريفي للشركة السعودية لخدمات الشركة وطرق التواصل معهم",
      en: "The Modern Programming Company platform is an informational website for the Saudi company, providing company services and ways to contact them.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content%20(3).png?raw=true",
    component: "Project11",
    technologies: ["WordPress", "SEO", "Elementor", "PHP", "MySQL"],
  },
  {
    id: 12,
    title: { ar: "شركة رمس للخدمات المتكاملة", en: "Rams Integrated Services Company" },
    description: {
      ar: "منصة شركة رمس للخدمات المتكاملة موقع تعريفي للشركة السعودية لخدمات الشركة وما يميز الموقع السهولة والبساطة",
      en: "The Rams Integrated Services Company platform is an introductory website for the Saudi company's services. What distinguishes the site is its ease of use and simplicity.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content%20(4).png?raw=true",
    component: "Project12",
    technologies: ["WordPress", "SEO", "Elementor", "PHP"],
  },
  {
    id: 13,
    title: { ar: "صحيفة رمس", en: "Rams Newspaper" },
    description: {
      ar: "جريدة رمس  جريدة لنشر الاخبار اليومية تابعة لشركة السعودية وما يميز الموقع السهولة والبساطة والظهور علي محركات ",
      en: "Rams Newspaper is a daily news publication owned by a Saudi company. What distinguishes the site is its ease of use, simplicity, and search engine ranking.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content%20(6).png?raw=true",
    component: "Project13",
    technologies: ["WordPress", "SEO", "Elementor", "PHP"],
  },
  {
    id: 14,
    title: { ar: "نظام الفوتوجرافر", en: "Photographer's system" },
    description: {
      ar: "نظام الفوتوجرافر نظام Laravel كامل بلوحة تحكم StudioCore System  من اجل ادراة محل اوناين بسهولة وتخزين البيانات اونلاين بسهولة ",
      en: "Delivery app supporting PWA and mobile with location tracking and in-app payments",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/main/1.jpeg?raw=true",
    component: "Project14",
    technologies: ["Laravel","PHP","Bootstrap","CSS", "SEO","MySQL"],
  },
  {
    id: 15,
    title: { ar: "نظام إدارة الفنادق ", en: "Hotel Management System" },
    description: {
      ar: "نظام إدارة الفنادق نظام Laravel كامل بلوحة تحكم مسئول  من اجل ادراة فندق اونلاين وعمل سجل بالمصروفات والايردات وايدارة الفندق بالكامل",
      en: "A complete Laravel hotel management system with an administrator control panel for online hotel management, including expense and revenue tracking and full hotel management.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/main/9.jpeg?raw=true",
    component: "Project15",
    technologies: ["Laravel","PHP","Bootstrap","CSS", "SEO","MySQL"],
  },
  {
    id: 16,
    title: { ar: "نظام اداره العيادات", en: "Clinic management system" },
    description: {
      ar: " نظام اداره العيادات نظام Laravel كامل بلوحة تحكم مسئول  من اجل اداره العيادات اونلاين وعمل سجل بالمصروفات والايردات وايدارة العيادة بالكامل",
      en: "A complete Laravel clinic management system with an administrator control panel for online clinic management, recording expenses and revenues, and full clinic management.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/main/14.jpeg?raw=true",
    component: "Project16",
    technologies: ["Laravel","PHP","Bootstrap","CSS", "SEO","MySQL"],
  },
  {
    id: 17,
    title: { ar: "موقع تعريفي لعيادة الدكتور رامي ", en: "Informational website for Dr. Rami's clinic" },
    description: {
      ar: "موقع تعريفي لعيادة الدكتور رامي التعريف بالدكتور رامي وانجازاتة في مجال التخسيس والرشاقة وحجز الموعيد والتواصل مع العياة ",
      en: "A website introducing Dr. Rami's clinic, featuring information about Dr. Rami, his achievements in weight loss and fitness, appointment booking, and clinic contact.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content%20(7).png?raw=true",
    component: "Project17",
     technologies: ["WordPress", "SEO", "Elementor", "PHP"],
  },
  {
    id: 18,
    title: { ar: "موقع مشاهدة الانمي والافلام ", en: "Anime and movie streaming website" },
    description: {
      ar: "الموقع الحصري لمشاهدة الانمي والافلام مع سيرفرات مشاهدة متعددة وسيرفرات تحمسل وصفحات مسلسل متنوعة وغيرها من الميزات الاخر ويوجد نسخة بلوجر ونسخة ورد بريس",
      en: "The exclusive website for watching anime and movies with multiple streaming servers, download servers, diverse series pages, and other features. Blogger and WordPress versions are available.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content%20(8).png?raw=true",
    component: "Project18",
     technologies: ["WordPress", "Blogger","CSS","JavaScript","SEO", "Elementor", "PHP"],
  },
  {
    id: 19,
    title: { ar: "متجر unitystyles الخاص بالملابس الداخلية فقط", en: "Unitystyles is a lingerie-only store" },
    description: {
      ar: "الموقع موقع الدروب شيبنج الخاص ببيع الملابس الداخلية للنساء فقط حيث يعمل المتجر من خلال الكثير من المتاجر وبه اضافة خاصة لسحب المنتجات من اكثر من 200 متجر حول العالم من لجميع البلاد المختلفة",
      en: "The website is a dropshipping platform specializing in women's underwear. The store operates through numerous retailers and features a dedicated add-on for retrieving products from over 200 stores worldwide, serving various countries.",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/content%20(9).png?raw=true",
    component: "Project19",
    technologies: ["WordPress", "SEO", "Elementor", "PHP"],
  },
  {id: 20,
    title: { ar: "محفظة استثمارية", en: "Investment Portfolio" },
    description: {
      ar: "تطبيق لتتبع الاستثمارات ",
      en: "Investment tracking and portfolio management application",
    },
    image:
      "https://github.com/ahmedtitio/frontend/blob/main/src/assets/967689.png?raw=true",
    component: "Project20",
    technologies: ["Vue","PHP", "Laravel", "MySQL", "SEO",],
  },
];
