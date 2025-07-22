import { createClient } from '@supabase/supabase-js'

// Replace these with your actual values:
const SUPABASE_URL = 'https://dxxulkrpbcmuhzkyxwfc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eHVsa3JwYmNtdWh6a3l4d2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MzY3MDgsImV4cCI6MjA2ODExMjcwOH0.CSk0Pi1CSvpHhgLDe7RnOM3gsuMpObr_8u0v3HrGaI0'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function login() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'bruhnon69@gmail.com',
    password: 'password123'
  })

  if (error) {
    console.error('Login failed:', error.message)
  } else {
    console.log('ACCESS TOKEN:', data.session.access_token)
  }
}

login()
