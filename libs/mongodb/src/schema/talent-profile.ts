import { ProjectKickoffTimeline } from '@easworks/models/job-post';
import { EnglishProficiency, JobSearchStatus, OverallExperience, TalentProfile, TalentSignupReason } from '@easworks/models/talent-profile';
import { InitialProfileData, User } from '@easworks/models/user';
import { EntitySchema } from '@mikro-orm/core';
import { user_schema } from './user';

export const talent_profile_schema = new EntitySchema<TalentProfile>({
  collection: 'talent-profiles',
  name: 'TalentProfile',
  properties: {
    user: { kind: '1:1', entity: () => user_schema, fieldName: '_id', primary: true, owner: true },
    experience: { type: 'json', object: true },
    workPreference: { type: 'json', object: true },
    personalDetails: { type: 'json', object: true },
    professionalDetails: { type: 'json', object: true },
    profileCompletion: { type: 'json', object: true }
  }
});

export function initialTalentProfile(
  user: User,
  data: InitialProfileData
): TalentProfile {
  return {
    experience: {
      domains: data.domains.map(id => ({
        id,
        modules: [],
        roles: [],
        services: [],
        years: null as unknown as number
      })),
      softwareProducts: data.softwareProducts.map(id => ({
        id,
        years: null as unknown as number
      })),
      industries: [],
      tech: []
    },
    personalDetails: {
      citizenship: null,
      contact: {
        email: user.email,
        address: {
          line1: null as unknown as string,
          line2: null,
          city: null,
          state: null,
          country: null as unknown as string,
          postalCode: null as unknown as string,
        },
        phone: {
          mobile: null,
          telegram: null,
          whatsapp: null
        }
      },
      education: [],
      firstName: user.firstName,
      image: user.imageUrl,
      lastName: user.lastName,
      location: {
        city: null,
        country: null as unknown as string,
        state: null,
        timezone: null as unknown as string
      },
      resume: null,
      signupReason: null as unknown as TalentSignupReason,
      social: {
        linkedin: null,
        github: null,
        gitlab: null
      }
    },
    professionalDetails: {
      currentRole: null as unknown as string,
      englishProficiency: null as unknown as EnglishProficiency,
      history: [],
      overallExperience: null as unknown as OverallExperience,
      portfolio: null,
      summary: null as unknown as string,
      wasFreelancer: false
    },
    workPreference: {
      availability: null as unknown as ProjectKickoffTimeline,
      commitment: [],
      interest: [],
      rates: {
        annually: null,
        hourly: null,
        monthly: null
      },
      roles: [],
      searchStatus: null as unknown as JobSearchStatus,
      time: {
        end: null as unknown as string,
        start: null as unknown as string,
        timezone: null as unknown as string
      }
    },
    user,
    profileCompletion: {
      about: 0,
      completed: false,
      easExperience: 0,
      easSystemPhases: 0,
      experience: 0,
      jobRole: 0,
      jobSearchStatus: 0,
      overall: 0,
      rates: 0,
      social: 0,
      summary: 0,
      techStacks: 0,
      wsa: 0
    }
  };
}