'use client';

import { createContext, useContext } from 'react';
import { Project, Skill } from '../types';

export interface SiteDataValue {
  projects: Project[];
  skills: Skill[];
  settings: Record<string, string>;
}

const SiteDataContext = createContext<SiteDataValue | null>(null);

export function SiteDataProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SiteDataValue;
}) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

/**
 * قراءة بيانات الموقع (المشاريع/المهارات/الإعدادات) القادمة من قاعدة البيانات.
 * في حال عدم توفر Provider نرجع إلى الملفات الثابتة كـ fallback
 * حتى لا تنكسر أي مكوّنات قديمة.
 */
export function useSiteData(): SiteDataValue {
  const ctx = useContext(SiteDataContext);
  if (ctx) return ctx;
  // Fallback to static data files if provider is missing
  const { projects } = require('../data/projects');
  const { skills } = require('../data/skills');
  return { projects, skills, settings: {} };
}
