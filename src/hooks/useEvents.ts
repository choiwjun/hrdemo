'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Event } from '@/types/database'
import eventsData from '@/mocks/events.json'

// Mock 데이터 타입 변환
const mockEvents: Event[] = eventsData.events as Event[]

// 이벤트 필터 타입
export interface EventFilters {
  year?: number
  month?: number
  startDate?: string
  endDate?: string
}

// 날짜 범위에 해당하는 이벤트 필터링
function filterEvents(events: Event[], filters: EventFilters): Event[] {
  return events.filter((event) => {
    if (event.deleted_at) return false

    const eventStart = new Date(event.start_at)

    if (filters.year && filters.month) {
      const eventYear = eventStart.getFullYear()
      const eventMonth = eventStart.getMonth() + 1
      if (eventYear !== filters.year || eventMonth !== filters.month) {
        return false
      }
    }

    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate)
      const end = new Date(filters.endDate)
      const eventEnd = new Date(event.end_at)

      // 이벤트가 범위와 겹치는지 확인
      if (eventEnd < start || eventStart > end) {
        return false
      }
    }

    return true
  })
}

// 이벤트 정렬 (시작 시간순)
function sortEvents(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    return new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
  })
}

// 이벤트 목록 조회 훅
export function useEvents(filters: EventFilters = {}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const filtered = filterEvents(mockEvents, filters)
      return sortEvents(filtered)
    },
    staleTime: 1000 * 60, // 1분간 캐시
  })
}

// 오늘 이벤트 조회 훅
export function useTodayEvents() {
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]

  return useQuery({
    queryKey: ['events', 'today'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      return mockEvents.filter((event) => {
        if (event.deleted_at) return false
        const eventDate = new Date(event.start_at).toISOString().split('T')[0]
        return eventDate === todayString
      }).sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
    },
    staleTime: 1000 * 60, // 1분간 캐시
  })
}

// 단일 이벤트 조회 훅
export function useEvent(eventId: string | null) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      if (!eventId) return null
      await new Promise((resolve) => setTimeout(resolve, 100))
      return mockEvents.find((e) => e.id === eventId && !e.deleted_at) || null
    },
    enabled: !!eventId,
  })
}

// 이벤트 생성
export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Omit<Event, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'deleted_at'>) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const now = new Date().toISOString()

      const newEvent: Event = {
        id: `event-${Date.now()}`,
        user_id: 'user-001',
        ...data,
        created_at: now,
        updated_at: now,
        deleted_at: null,
      }

      mockEvents.push(newEvent)
      return newEvent
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// 이벤트 수정
export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ eventId, updates }: { eventId: string; updates: Partial<Event> }) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const now = new Date().toISOString()

      const eventIndex = mockEvents.findIndex((e) => e.id === eventId)
      if (eventIndex === -1) {
        throw new Error('이벤트를 찾을 수 없습니다.')
      }

      mockEvents[eventIndex] = {
        ...mockEvents[eventIndex],
        ...updates,
        updated_at: now,
      }

      return mockEvents[eventIndex]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}

// 이벤트 삭제
export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (eventId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const now = new Date().toISOString()

      const event = mockEvents.find((e) => e.id === eventId)
      if (event) {
        event.deleted_at = now
        event.updated_at = now
      }

      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
