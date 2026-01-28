import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

const initialState = {
  user: null,
  profile: null,
  isLoading: true,
  isAuthenticated: false,
}

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}))
