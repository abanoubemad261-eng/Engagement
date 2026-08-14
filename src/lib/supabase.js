import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

let client = null

// Never let a bad/missing Vercel environment variable crash the whole invitation.
// The public site can still render while Supabase-backed features are unavailable.
if (url && anonKey) {
  try {
    client = createClient(url, anonKey)
  } catch (error) {
    console.error('Supabase initialization failed:', error)
  }
}

export const supabase = client
export const hasSupabase = Boolean(client)
