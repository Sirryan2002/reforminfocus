// Supabase database types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: {
          id: number
          title: string
          slug: string
          excerpt: string
          content: string
          author_name: string | null
          featured_image_url: string | null
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
          read_time_minutes: number | null
          article_type: 'topic' | 'research' | 'opinion' | 'understanding'
          easyid: number | null
          pinned: boolean | null
        }
        Insert: {
          id?: number
          title: string
          slug: string
          excerpt: string
          content: string
          author_name?: string | null
          featured_image_url?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          read_time_minutes?: number | null
          article_type?: 'topic' | 'research' | 'opinion' | 'understanding'
          easyid?: number | null
          pinned?: boolean | null
        }
        Update: {
          id?: number
          title?: string
          slug?: string
          excerpt?: string
          content?: string
          author_name?: string | null
          featured_image_url?: string | null
          published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          read_time_minutes?: number | null
          article_type?: 'topic' | 'research' | 'opinion' | 'understanding'
          easyid?: number | null
          pinned?: boolean | null
        }
      }
      tags: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
      }
      article_tags: {
        Row: {
          article_id: number
          tag_id: number
        }
        Insert: {
          article_id: number
          tag_id: number
        }
        Update: {
          article_id?: number
          tag_id?: number
        }
      }
      clusters: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          icon_or_image_url: string | null
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          icon_or_image_url?: string | null
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          icon_or_image_url?: string | null
          display_order?: number | null
          created_at?: string
        }
      }
      cluster_tags: {
        Row: {
          cluster_id: number
          tag_id: number
        }
        Insert: {
          cluster_id: number
          tag_id: number
        }
        Update: {
          cluster_id?: number
          tag_id?: number
        }
      }
      subscribers: {
        Row: {
          id: number
          email: string
          subscribed_at: string
          is_active: boolean
          preferences: Json | null
        }
        Insert: {
          id?: number
          email: string
          subscribed_at?: string
          is_active?: boolean
          preferences?: Json | null
        }
        Update: {
          id?: number
          email?: string
          subscribed_at?: string
          is_active?: boolean
          preferences?: Json | null
        }
      }
      contact_submissions: {
        Row: {
          id: number
          name: string
          email: string
          subject: string
          message: string
          submitted_at: string
          is_read: boolean
        }
        Insert: {
          id?: number
          name: string
          email: string
          subject: string
          message: string
          submitted_at?: string
          is_read?: boolean
        }
        Update: {
          id?: number
          name?: string
          email?: string
          subject?: string
          message?: string
          submitted_at?: string
          is_read?: boolean
        }
      }
      users: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: number
          user_id: string
          article_id: number
          memo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          article_id: number
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          article_id?: number
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      authors: {
        Row: {
          id: number
          name: string
          slug: string
          avatar_url: string | null
          bio: string | null
          title: string | null
          social_links: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          avatar_url?: string | null
          bio?: string | null
          title?: string | null
          social_links?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          avatar_url?: string | null
          bio?: string | null
          title?: string | null
          social_links?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      article_authors: {
        Row: {
          article_id: number
          author_id: number
          author_order: number
        }
        Insert: {
          article_id: number
          author_id: number
          author_order?: number
        }
        Update: {
          article_id?: number
          author_id?: number
          author_order?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      article_type: 'topic' | 'research' | 'opinion' | 'understanding'
    }
  }
}
