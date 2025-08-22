import { createClient } from '@supabase/supabase-js'

// Create a function to get the Supabase client
// This prevents the client from being created during build time
export function getSupabaseClient() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}



// Types for our comments
export interface Comment {
  id: string
  post_slug: string
  nickname: string
  content: string
  created_at: string
  updated_at: string
}

export interface CreateCommentData {
  post_slug: string
  nickname: string
  content: string
}
