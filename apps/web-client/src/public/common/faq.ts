export interface FAQ {
  question: string;
  content: string[];
}

export interface FAQGroup {
  name: string;
  items: FAQ[];
}