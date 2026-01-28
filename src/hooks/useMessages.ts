'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Message, Label } from '@/types/database'
import messagesData from '@/mocks/messages.json'
import labelsData from '@/mocks/labels.json'

// Mock 데이터 타입 변환
const mockMessages: Message[] = messagesData.messages as Message[]
const mockLabels: Label[] = labelsData.labels as Label[]

// 메시지 필터 타입
export interface MessageFilters {
  service?: 'gmail' | 'slack' | 'all'
  view?: 'inbox' | 'sent' | 'draft' | 'starred' | 'spam' | 'trash'
  search?: string
  labelId?: string
}

// 메시지 필터링 함수
function filterMessages(messages: Message[], filters: MessageFilters): Message[] {
  return messages.filter((msg) => {
    // 서비스 필터
    if (filters.service && filters.service !== 'all' && msg.service !== filters.service) {
      return false
    }

    // 뷰 필터
    switch (filters.view) {
      case 'inbox':
        if (msg.message_type !== 'received' || msg.is_trash || msg.is_spam) return false
        break
      case 'sent':
        if (msg.message_type !== 'sent' || msg.is_trash) return false
        break
      case 'draft':
        if (msg.message_type !== 'draft') return false
        break
      case 'starred':
        if (!msg.is_starred || msg.is_trash) return false
        break
      case 'spam':
        if (!msg.is_spam) return false
        break
      case 'trash':
        if (!msg.is_trash) return false
        break
    }

    // 검색 필터
    if (filters.search && filters.search.length >= 2) {
      const searchLower = filters.search.toLowerCase()
      const matchSubject = msg.subject?.toLowerCase().includes(searchLower)
      const matchBody = msg.body?.toLowerCase().includes(searchLower)
      const matchFrom = msg.from_address?.toLowerCase().includes(searchLower)
      if (!matchSubject && !matchBody && !matchFrom) return false
    }

    return true
  })
}

// 메시지 정렬 (최신순)
function sortMessages(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => {
    const dateA = a.received_at || a.created_at
    const dateB = b.received_at || b.created_at
    return new Date(dateB).getTime() - new Date(dateA).getTime()
  })
}

// 메시지 목록 조회 훅
export function useMessages(filters: MessageFilters = {}) {
  return useQuery({
    queryKey: ['messages', filters],
    queryFn: async () => {
      // Mock: 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 300)) // 네트워크 지연 시뮬레이션
      const filtered = filterMessages(mockMessages, filters)
      return sortMessages(filtered)
    },
    staleTime: 1000 * 60, // 1분간 캐시
  })
}

// 단일 메시지 조회 훅
export function useMessage(messageId: string | null) {
  return useQuery({
    queryKey: ['message', messageId],
    queryFn: async () => {
      if (!messageId) return null
      await new Promise((resolve) => setTimeout(resolve, 100))
      return mockMessages.find((m) => m.id === messageId) || null
    },
    enabled: !!messageId,
  })
}

// 라벨 목록 조회 훅
export function useLabels() {
  return useQuery({
    queryKey: ['labels'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return mockLabels
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })
}

// 메시지 읽음/안읽음 토글
export function useToggleRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messageId, isRead }: { messageId: string; isRead: boolean }) => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      // Mock: 실제로는 API 호출
      const message = mockMessages.find((m) => m.id === messageId)
      if (message) {
        message.is_read = isRead
        message.updated_at = new Date().toISOString()
      }
      return message
    },
    onMutate: async ({ messageId, isRead }) => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ['messages'] })

      const previousMessages = queryClient.getQueryData(['messages'])

      queryClient.setQueriesData({ queryKey: ['messages'] }, (old: Message[] | undefined) => {
        if (!old) return old
        return old.map((m) => (m.id === messageId ? { ...m, is_read: isRead } : m))
      })

      return { previousMessages }
    },
    onError: (_err, _variables, context) => {
      // 롤백
      if (context?.previousMessages) {
        queryClient.setQueriesData({ queryKey: ['messages'] }, context.previousMessages)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

// 메시지 별표 토글
export function useToggleStar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messageId, isStarred }: { messageId: string; isStarred: boolean }) => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const message = mockMessages.find((m) => m.id === messageId)
      if (message) {
        message.is_starred = isStarred
        message.updated_at = new Date().toISOString()
      }
      return message
    },
    onMutate: async ({ messageId, isStarred }) => {
      await queryClient.cancelQueries({ queryKey: ['messages'] })

      const previousMessages = queryClient.getQueryData(['messages'])

      queryClient.setQueriesData({ queryKey: ['messages'] }, (old: Message[] | undefined) => {
        if (!old) return old
        return old.map((m) => (m.id === messageId ? { ...m, is_starred: isStarred } : m))
      })

      return { previousMessages }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueriesData({ queryKey: ['messages'] }, context.previousMessages)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

// 메시지 삭제 (휴지통으로 이동)
export function useDeleteMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messageId, permanent = false }: { messageId: string; permanent?: boolean }) => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const messageIndex = mockMessages.findIndex((m) => m.id === messageId)
      if (messageIndex !== -1) {
        if (permanent) {
          mockMessages.splice(messageIndex, 1)
        } else {
          mockMessages[messageIndex].is_trash = true
          mockMessages[messageIndex].updated_at = new Date().toISOString()
        }
      }
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

// 메시지 복원 (휴지통에서)
export function useRestoreMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (messageId: string) => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const message = mockMessages.find((m) => m.id === messageId)
      if (message) {
        message.is_trash = false
        message.updated_at = new Date().toISOString()
      }
      return message
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

// 일괄 읽음/안읽음 처리
export function useBulkToggleRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ messageIds, isRead }: { messageIds: string[]; isRead: boolean }) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      messageIds.forEach((id) => {
        const message = mockMessages.find((m) => m.id === id)
        if (message) {
          message.is_read = isRead
          message.updated_at = new Date().toISOString()
        }
      })
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

// 일괄 삭제
export function useBulkDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (messageIds: string[]) => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      messageIds.forEach((id) => {
        const message = mockMessages.find((m) => m.id === id)
        if (message) {
          message.is_trash = true
          message.updated_at = new Date().toISOString()
        }
      })
      return { success: true }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
    },
  })
}

// 미읽은 메시지 카운트
export function useUnreadCount() {
  return useQuery({
    queryKey: ['unreadCount'],
    queryFn: async () => {
      const unread = mockMessages.filter((m) => {
        if (m.is_read || m.is_trash || m.is_spam) return false
        if (m.message_type !== 'received') return false
        return true
      })

      const gmail = unread.filter((m) => m.service === 'gmail').length
      const slack = unread.filter((m) => m.service === 'slack').length

      return {
        total: unread.length,
        gmail,
        slack,
      }
    },
    staleTime: 1000 * 30, // 30초간 캐시
  })
}
