// app/blog/_types/index.ts

export interface ArticleSection {
  type:
    | 'paragraph'
    | 'heading'
    | 'subheading'
    | 'list'
    | 'code'
    | 'callout'
    | 'image'
    | 'quote'
    | 'divider'
    | 'steps';
  content?: string;
  items?: string[];
  language?: string;
  variant?: 'info' | 'success' | 'warning' | 'tip';
  title?: string;
  steps?: { title: string; description: string }[];
  id?: string;
}

export interface ArticleContent {
  intro: string;
  tableOfContents: { id: string; title: string }[];
  sections: ArticleSection[];
  faqs?: { question: string; answer: string }[];
}