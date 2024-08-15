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
  hex: {
    lowercase: /^[a-f0-9]+$/
  },
  base64: {
    urlSafe: /^[A-Za-z0-9_-]+$/
  }
} as const; 
