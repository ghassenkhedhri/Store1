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
          display_name: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          marketing_opt_in: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          marketing_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          marketing_opt_in?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      legal_acceptances: {
        Row: {
          id: string
          user_id: string
          terms_version: string
          privacy_version: string
          accepted_at: string
          ip: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          user_id: string
          terms_version: string
          privacy_version: string
          accepted_at?: string
          ip?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          terms_version?: string
          privacy_version?: string
          accepted_at?: string
          ip?: string | null
          user_agent?: string | null
        }
      }
      categories: {
        Row: {
          id: string
          parent_id: string | null
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id?: string | null
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string | null
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          category_id: string
          active: boolean
          price_cents: number
          currency: string
          rating: number | null
          tags: Json | null
          attributes: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          category_id: string
          active?: boolean
          price_cents: number
          currency?: string
          rating?: number | null
          tags?: Json | null
          attributes?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          category_id?: string
          active?: boolean
          price_cents?: number
          currency?: string
          rating?: number | null
          tags?: Json | null
          attributes?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          position?: number
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          position?: number
          created_at?: string
        }
      }
      variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          name: string
          price_delta_cents: number
          stock: number
          attributes: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          sku: string
          name: string
          price_delta_cents?: number
          stock?: number
          attributes?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          sku?: string
          name?: string
          price_delta_cents?: number
          stock?: number
          attributes?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      carts: {
        Row: {
          id: string
          user_id: string | null
          status: 'active' | 'ordered' | 'abandoned'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: 'active' | 'ordered' | 'abandoned'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: 'active' | 'ordered' | 'abandoned'
          created_at?: string
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          cart_id: string
          product_id: string
          variant_id: string | null
          qty: number
          price_cents_snapshot: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cart_id: string
          product_id: string
          variant_id?: string | null
          qty: number
          price_cents_snapshot: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cart_id?: string
          product_id?: string
          variant_id?: string | null
          qty?: number
          price_cents_snapshot?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          cart_id: string
          total_cents: number
          currency: string
          status: 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded'
          payment_status: string | null
          shipping_address: Json | null
          billing_address: Json | null
          created_at: string
          paid_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          cart_id: string
          total_cents: number
          currency?: string
          status?: 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded'
          payment_status?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          created_at?: string
          paid_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          cart_id?: string
          total_cents?: number
          currency?: string
          status?: 'pending' | 'paid' | 'fulfilled' | 'cancelled' | 'refunded'
          payment_status?: string | null
          shipping_address?: Json | null
          billing_address?: Json | null
          created_at?: string
          paid_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          qty: number
          unit_price_cents: number
          currency: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          qty: number
          unit_price_cents: number
          currency?: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string | null
          qty?: number
          unit_price_cents?: number
          currency?: string
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          provider: 'stripe' | 'wise' | 'manual' | 'other'
          provider_payment_id: string | null
          amount_cents: number
          status: string
          raw: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          provider: 'stripe' | 'wise' | 'manual' | 'other'
          provider_payment_id?: string | null
          amount_cents: number
          status: string
          raw?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          provider?: 'stripe' | 'wise' | 'manual' | 'other'
          provider_payment_id?: string | null
          amount_cents?: number
          status?: string
          raw?: Json | null
          created_at?: string
        }
      }
      wishlists: {
        Row: {
          user_id: string
          product_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          product_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          product_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string
          rating: number
          body: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          rating: number
          body?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          rating?: number
          body?: string | null
          created_at?: string
        }
      }
      marketing_subscriptions: {
        Row: {
          id: string
          user_id: string | null
          email: string
          list: string
          opted_in: boolean
          opted_in_at: string | null
          unsubscribed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          list: string
          opted_in?: boolean
          opted_in_at?: string | null
          unsubscribed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          list?: string
          opted_in?: boolean
          opted_in_at?: string | null
          unsubscribed_at?: string | null
          created_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          product_id: string | null
          platform: 'organic' | 'email' | 'social'
          budget_cents: number
          status: 'draft' | 'running' | 'paused' | 'completed'
          cpa_goal_cents: number | null
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          product_id?: string | null
          platform: 'organic' | 'email' | 'social'
          budget_cents: number
          status?: 'draft' | 'running' | 'paused' | 'completed'
          cpa_goal_cents?: number | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          product_id?: string | null
          platform?: 'organic' | 'email' | 'social'
          budget_cents?: number
          status?: 'draft' | 'running' | 'paused' | 'completed'
          cpa_goal_cents?: number | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      product_embeddings: {
        Row: {
          id: string
          product_id: string
          embedding: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          embedding: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          embedding?: string
          updated_at?: string
        }
      }
      competitor_products: {
        Row: {
          id: string
          product_id: string
          source: string
          url: string
          price_cents: number | null
          currency: string | null
          last_seen_at: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          source: string
          url: string
          price_cents?: number | null
          currency?: string | null
          last_seen_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          source?: string
          url?: string
          price_cents?: number | null
          currency?: string | null
          last_seen_at?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string | null
          type: string
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: string
          data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: string
          data?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      mv_trending_products: {
        Row: {
          product_id: string
          units_7d: number
          revenue_7d: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}