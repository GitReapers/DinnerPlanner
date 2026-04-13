import { supabase } from './supabase'

// sign up
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  return { data, error }
}

// sign in
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

// sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// get current user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  return { data, error }
}