'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { EventParticipant, Profile } from '@/types/database'
import eventParticipantsData from '@/mocks/event_participants.json'
import profilesData from '@/mocks/profiles.json'

// Mock 데이터 타입 변환
const mockEventParticipants: EventParticipant[] = eventParticipantsData.event_participants as EventParticipant[]
const mockProfiles: Profile[] = profilesData.profiles as Profile[]

// 현재 사용자 ID (Mock)
const CURRENT_USER_ID = 'user-001'

// 일정 참석자 타입 (프로필 정보 포함)
export interface ParticipantWithProfile extends EventParticipant {
  profile: Profile | null
}

// 일정별 참석자 목록 조회 훅
export function useEventParticipants(eventId: string | null) {
  return useQuery({
    queryKey: ['eventParticipants', eventId],
    queryFn: async () => {
      if (!eventId) return []
      await new Promise((resolve) => setTimeout(resolve, 100))

      const participants = mockEventParticipants.filter((p) => p.event_id === eventId)

      // 프로필 정보 매핑
      const participantsWithProfile: ParticipantWithProfile[] = participants.map((p) => ({
        ...p,
        profile: mockProfiles.find((profile) => profile.user_id === p.user_id) || null,
      }))

      return participantsWithProfile
    },
    enabled: !!eventId,
  })
}

// 참석자 추가
export function useAddParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ eventId, userIds }: { eventId: string; userIds: string[] }) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const now = new Date().toISOString()

      const newParticipants: EventParticipant[] = userIds.map((userId, index) => ({
        id: `ep-${Date.now()}-${index}`,
        event_id: eventId,
        user_id: userId,
        status: 'pending',
        created_at: now,
        updated_at: now,
      }))

      // 기존 참석자 중복 제거
      const existingUserIds = mockEventParticipants
        .filter((p) => p.event_id === eventId)
        .map((p) => p.user_id)

      const uniqueParticipants = newParticipants.filter(
        (p) => !existingUserIds.includes(p.user_id)
      )

      mockEventParticipants.push(...uniqueParticipants)
      return uniqueParticipants
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['eventParticipants', eventId] })
    },
  })
}

// 참석자 제거
export function useRemoveParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const index = mockEventParticipants.findIndex(
        (p) => p.event_id === eventId && p.user_id === userId
      )

      if (index !== -1) {
        mockEventParticipants.splice(index, 1)
      }

      return { success: true }
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['eventParticipants', eventId] })
    },
  })
}

// 참석 상태 변경 (본인만)
export function useUpdateParticipantStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      eventId,
      status,
    }: {
      eventId: string
      status: 'accepted' | 'declined'
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const now = new Date().toISOString()

      const participant = mockEventParticipants.find(
        (p) => p.event_id === eventId && p.user_id === CURRENT_USER_ID
      )

      if (participant) {
        participant.status = status
        participant.updated_at = now
      }

      return participant || null
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['eventParticipants', eventId] })
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// 내 참석 상태 조회
export function useMyParticipantStatus(eventId: string | null) {
  return useQuery({
    queryKey: ['eventParticipants', eventId, 'mine'],
    queryFn: async () => {
      if (!eventId) return null
      await new Promise((resolve) => setTimeout(resolve, 100))

      return mockEventParticipants.find(
        (p) => p.event_id === eventId && p.user_id === CURRENT_USER_ID
      ) || null
    },
    enabled: !!eventId,
  })
}
