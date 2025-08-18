export type Section = 'home' | 'blog' | 'likes' | 'projects' | 'misc';

export interface LinkItem { label: string; href: string; }

export interface ContentItem {
  id: string;
  slug: string;
  section: Exclude<Section, 'home'>;
  sections?: string[];
  title: string;
  date: string;
  tags: string[];
  displayUrl?: string | null;
  image?: string | null;
  description?: string | null;
  link?: string | null;
  links?: LinkItem[];
  markdown?: string;
  vaultPath: string;
  public: boolean;
  readingTime?: string | null;
}

export interface ContentIndex {
  generatedAt: string;
  total: number;
  tags: string[];
  items: ContentItem[];
}
