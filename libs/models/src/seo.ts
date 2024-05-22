const regex = {
  nonUrlCharacters: /[^a-z0-9/]+/g,
  trailingHyphen: /^-+|-+$/g
} as const;

export function convertToSlug(text: string) {
  return text
    .toLowerCase()
    .replace(regex.nonUrlCharacters, '-')
    .replace(regex.trailingHyphen, '');
}

