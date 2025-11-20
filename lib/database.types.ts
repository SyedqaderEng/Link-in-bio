export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          theme_id: string | null
          custom_css: string | null
          is_premium: boolean
          subscription_tier: 'free' | 'pro' | 'lifetime'
          custom_domain: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme_id?: string | null
          custom_css?: string | null
          is_premium?: boolean
          subscription_tier?: 'free' | 'pro' | 'lifetime'
          custom_domain?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          theme_id?: string | null
          custom_css?: string | null
          is_premium?: boolean
          subscription_tier?: 'free' | 'pro' | 'lifetime'
          custom_domain?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      links: {
        Row: {
          id: string
          user_id: string
          title: string
          url: string
          icon: string | null
          position: number
          is_active: boolean
          scheduled_start: string | null
          scheduled_end: string | null
          click_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          url: string
          icon?: string | null
          position?: number
          is_active?: boolean
          scheduled_start?: string | null
          scheduled_end?: string | null
          click_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          url?: string
          icon?: string | null
          position?: number
          is_active?: boolean
          scheduled_start?: string | null
          scheduled_end?: string | null
          click_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          link_id: string | null
          user_id: string
          event_type: 'view' | 'click' | 'share'
          referrer: string | null
          country: string | null
          city: string | null
          device: string | null
          browser: string | null
          created_at: string
        }
        Insert: {
          id?: string
          link_id?: string | null
          user_id: string
          event_type: 'view' | 'click' | 'share'
          referrer?: string | null
          country?: string | null
          city?: string | null
          device?: string | null
          browser?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          link_id?: string | null
          user_id?: string
          event_type?: 'view' | 'click' | 'share'
          referrer?: string | null
          country?: string | null
          city?: string | null
          device?: string | null
          browser?: string | null
          created_at?: string
        }
      }
      themes: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          preview_url: string | null
          config: Json
          is_premium: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          preview_url?: string | null
          config?: Json
          is_premium?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          preview_url?: string | null
          config?: Json
          is_premium?: boolean
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          tier: 'free' | 'pro' | 'lifetime'
          status: 'active' | 'canceled' | 'past_due'
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          tier?: 'free' | 'pro' | 'lifetime'
          status?: 'active' | 'canceled' | 'past_due'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          tier?: 'free' | 'pro' | 'lifetime'
          status?: 'active' | 'canceled' | 'past_due'
          current_period_start?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
