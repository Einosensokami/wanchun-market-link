import { createClient } from '@supabase/supabase-js'

function createSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !publishableKey) return null

  return createClient(url, publishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
}

export const supabase = createSupabaseClient()
export const isSupabaseConfigured = supabase !== null
