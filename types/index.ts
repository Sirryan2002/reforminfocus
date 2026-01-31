import { Database } from './database';

// Extract table row types from database schema
export type Article = Database['public']['Tables']['articles']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Cluster = Database['public']['Tables']['clusters']['Row'];
export type Subscriber = Database['public']['Tables']['subscribers']['Row'];
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type Bookmark = Database['public']['Tables']['bookmarks']['Row'];

// Insert types for creating new records
export type ArticleInsert = Database['public']['Tables']['articles']['Insert'];
export type TagInsert = Database['public']['Tables']['tags']['Insert'];
export type ClusterInsert = Database['public']['Tables']['clusters']['Insert'];
export type SubscriberInsert = Database['public']['Tables']['subscribers']['Insert'];
export type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert'];

// Update types for modifying records
export type ArticleUpdate = Database['public']['Tables']['articles']['Update'];
export type TagUpdate = Database['public']['Tables']['tags']['Update'];
export type ClusterUpdate = Database['public']['Tables']['clusters']['Update'];

// Article type enum
export type ArticleType = 'topic' | 'research' | 'opinion' | 'understanding';

// Extended article type with related data
export type ArticleWithTags = Article & {
  tags?: Tag[];
};

export type ArticleWithRelations = Article & {
  tags?: Tag[];
  clusters?: Cluster[];
};

// Cluster with tags
export type ClusterWithTags = Cluster & {
  tags?: Tag[];
};

// Subscriber preferences type
export type SubscriberPreferences = {
  weekly_newsletter?: boolean;
  article_alerts?: boolean;
  research_updates?: boolean;
  cluster_preferences?: {
    literacy?: boolean;
    funding?: boolean;
    teacher_pipeline?: boolean;
    school_choice?: boolean;
  };
};

// API response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type PaginatedResponse<T> = ApiResponse<T> & {
  count?: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
};

// Form types
export type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type SubscribeFormData = {
  email: string;
  preferences: SubscriberPreferences;
};

// Article card props (for display)
export type ArticleCardData = Pick<Article,
  'id' | 'title' | 'slug' | 'excerpt' | 'published_at' | 'read_time_minutes' | 'article_type' | 'featured_image_url'
> & {
  tags?: Tag[];
};
