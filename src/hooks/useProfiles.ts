'use client'

import { useQuery } from '@tanstack/react-query'
import type { Profile } from '@/types/database'
import profilesData from '@/mocks/profiles.json'

// Mock 데이터 타입 변환
const mockProfiles: Profile[] = profilesData.profiles as Profile[]

// 현재 사용자 ID (Mock)
const CURRENT_USER_ID = 'user-001'

// 전체 프로필 목록 조회 훅
export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return mockProfiles
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })
}

// 현재 사용자 프로필 조회 훅
export function useCurrentProfile() {
  return useQuery({
    queryKey: ['profile', 'current'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return mockProfiles.find((p) => p.user_id === CURRENT_USER_ID) || null
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })
}

// 단일 프로필 조회 훅
export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null
      await new Promise((resolve) => setTimeout(resolve, 100))
      return mockProfiles.find((p) => p.user_id === userId) || null
    },
    enabled: !!userId,
  })
}

// 팀원 목록 조회 (현재 사용자 제외)
export function useTeamMembers() {
  return useQuery({
    queryKey: ['profiles', 'team'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return mockProfiles.filter((p) => p.user_id !== CURRENT_USER_ID)
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })
}

// 현재 사용자 ID 가져오기 (Mock)
export function getCurrentUserId() {
  return CURRENT_USER_ID
}
