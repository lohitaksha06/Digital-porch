// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// This function creates a Supabase client for the browser.
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )