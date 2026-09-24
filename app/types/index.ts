export interface Project {
  id: number;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  image: string;
  component: string; // Changed from htmlFile to component
  technologies: string[];
}

export interface Skill {
  name: string;
  percentage: number;
  icon: string;
  category: 'frontend' | 'backend' | 'tools' | 'design';
}

export type Language = 'ar' | 'en';
export type Theme = 'light' | 'dark';