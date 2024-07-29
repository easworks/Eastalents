export const pattern = {
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  telephone: /^[\d+\- ]+$/,
  linkedin: {
    profile: /^(https:\/\/)?(www\.)?linkedin\.com\/in\/[^/]+\/?$/
  },
  github: {
    profile: /^(https:\/\/)?(www\.)?github\.com\/[^/]+\/?$/
  },
  gitlab: {
    profile: /^(https:\/\/)?(www\.)?gitlab\.com\/[^/]+\/?$/
  },
  slug: /^[a-z0-9-]+$/,
  nickname: /^[a-z0-9_]+$/,
  hex: {
    lowercase: /^[a-f0-9]+$/
  }
} as const; 
