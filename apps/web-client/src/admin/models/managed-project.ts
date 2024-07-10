import { DateTime } from 'luxon';
import { ProjectType } from './job-post';

export interface ManagedProject {
  _id: string;
  name: string;
  type: ProjectType;

  objectives: string;
  currentState: string;

  // key performance indicators
  kpis: string;
  postLaunchSupport: string;

  details: string;

  timeline: {
    start: DateTime;
    end: DateTime;
  };
  budget: number;

  softwareProducts: string[];
  techSkills: string[];
}
