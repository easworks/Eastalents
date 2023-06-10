export const SKILL_OPTIONS = [
  'Fresher',
  'Intermediate',
  'Advanced'
] as const;

export type SkillLevel = typeof SKILL_OPTIONS[number];

export interface ExperienceData {
  name: string;
  years: number;
  skill: SkillLevel;
}
