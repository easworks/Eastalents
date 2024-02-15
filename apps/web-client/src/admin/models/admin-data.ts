import { TechGroup, TechSkill } from '../models/tech-skill';
import { EASRole } from './eas-role';

export interface AdminDataState {
  skills: TechSkill[];
  techGroups: TechGroup[];
  easRole: EASRole[];
}
