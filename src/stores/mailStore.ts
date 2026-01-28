import { create } from 'zustand'
import type { Message, Label } from '@/types/database'

export type ServiceFilter = 'all' | 'gmail' | 'slack'
export type ViewType = 'inbox' | 'sent' | 'draft' | 'spam' | 'trash' | 'starred'
export type RecipientFilter = 'all' | 'to' | 'cc' | 'bcc' | 'mention'

interface MailState {
  // Filters
  serviceFilter: ServiceFilter
  activeView: ViewType
  recipientFilter: RecipientFilter
  searchQuery: string
  selectedLabelId: string | null

  // Selection
  selectedMessageIds: string[]
  activeMessageId: string | null

  // Data
  messages: Message[]
  labels: Label[]

  // UI state
  isComposeOpen: boolean
  isDetailOpen: boolean

  // Actions - Filters
  setServiceFilter: (filter: ServiceFilter) => void
  setActiveView: (view: ViewType) => void
  setRecipientFilter: (filter: RecipientFilter) => void
  setSearchQuery: (query: string) => void
  setSelectedLabelId: (labelId: string | null) => void

  // Actions - Selection
  setSelectedMessageIds: (ids: string[]) => void
  toggleMessageSelection: (id: string) => void
  selectAllMessages: () => void
  clearSelection: () => void
  setActiveMessageId: (id: string | null) => void

  // Actions - Data
  setMessages: (messages: Message[]) => void
  setLabels: (labels: Label[]) => void
  updateMessage: (id: string, updates: Partial<Message>) => void
  updateMessages: (ids: string[], updates: Partial<Message>) => void

  // Actions - UI
  setComposeOpen: (open: boolean) => void
  setDetailOpen: (open: boolean) => void

  // Reset
  reset: () => void
}

const initialState = {
  serviceFilter: 'all' as ServiceFilter,
  activeView: 'inbox' as ViewType,
  recipientFilter: 'all' as RecipientFilter,
  searchQuery: '',
  selectedLabelId: null,
  selectedMessageIds: [],
  activeMessageId: null,
  messages: [],
  labels: [],
  isComposeOpen: false,
  isDetailOpen: false,
}

export const useMailStore = create<MailState>((set, get) => ({
  ...initialState,

  // Filters
  setServiceFilter: (serviceFilter) => set({ serviceFilter }),
  setActiveView: (activeView) => set({ activeView, selectedMessageIds: [], activeMessageId: null }),
  setRecipientFilter: (recipientFilter) => set({ recipientFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedLabelId: (selectedLabelId) => set({ selectedLabelId }),

  // Selection
  setSelectedMessageIds: (selectedMessageIds) => set({ selectedMessageIds }),
  toggleMessageSelection: (id) => {
    const { selectedMessageIds } = get()
    if (selectedMessageIds.includes(id)) {
      set({ selectedMessageIds: selectedMessageIds.filter((msgId) => msgId !== id) })
    } else {
      set({ selectedMessageIds: [...selectedMessageIds, id] })
    }
  },
  selectAllMessages: () => {
    const { messages } = get()
    set({ selectedMessageIds: messages.map((m) => m.id) })
  },
  clearSelection: () => set({ selectedMessageIds: [] }),
  setActiveMessageId: (activeMessageId) => set({ activeMessageId, isDetailOpen: !!activeMessageId }),

  // Data
  setMessages: (messages) => set({ messages }),
  setLabels: (labels) => set({ labels }),
  updateMessage: (id, updates) => {
    const { messages } = get()
    set({
      messages: messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })
  },
  updateMessages: (ids, updates) => {
    const { messages } = get()
    set({
      messages: messages.map((m) => (ids.includes(m.id) ? { ...m, ...updates } : m)),
    })
  },

  // UI
  setComposeOpen: (isComposeOpen) => set({ isComposeOpen }),
  setDetailOpen: (isDetailOpen) => set({ isDetailOpen }),

  // Reset
  reset: () => set(initialState),
}))
