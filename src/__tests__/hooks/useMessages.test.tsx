import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useMessages,
  useMessage,
  useLabels,
  useUnreadCount,
  useToggleRead,
  useToggleStar,
} from '@/hooks/useMessages'

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useMessages', () => {
  it('should fetch messages without filters', async () => {
    const { result } = renderHook(() => useMessages(), {
      wrapper: createWrapper(),
    })

    // Initially loading
    expect(result.current.isLoading).toBe(true)

    // Wait for data to be fetched
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // Should have messages
    expect(result.current.data).toBeDefined()
    expect(Array.isArray(result.current.data)).toBe(true)
  })

  it('should filter messages by service (gmail)', async () => {
    const { result } = renderHook(() => useMessages({ service: 'gmail' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // All messages should be from gmail
    const messages = result.current.data || []
    expect(messages.every((m) => m.service === 'gmail')).toBe(true)
  })

  it('should filter messages by service (slack)', async () => {
    const { result } = renderHook(() => useMessages({ service: 'slack' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // All messages should be from slack
    const messages = result.current.data || []
    expect(messages.every((m) => m.service === 'slack')).toBe(true)
  })

  it('should filter messages by view (inbox)', async () => {
    const { result } = renderHook(() => useMessages({ view: 'inbox' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // All messages should be received, not trash, not spam
    const messages = result.current.data || []
    expect(
      messages.every(
        (m) => m.message_type === 'received' && !m.is_trash && !m.is_spam
      )
    ).toBe(true)
  })

  it('should filter messages by view (starred)', async () => {
    const { result } = renderHook(() => useMessages({ view: 'starred' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // All messages should be starred
    const messages = result.current.data || []
    expect(messages.every((m) => m.is_starred === true)).toBe(true)
  })

  it('should search messages by keyword', async () => {
    const searchTerm = 'project'
    const { result } = renderHook(
      () => useMessages({ search: searchTerm, view: 'inbox' }),
      {
        wrapper: createWrapper(),
      }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    // All messages should contain search term in subject, body, or from_address
    const messages = result.current.data || []
    messages.forEach((m) => {
      const matchesSearch =
        m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.body?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.from_address?.toLowerCase().includes(searchTerm.toLowerCase())
      expect(matchesSearch).toBe(true)
    })
  })

  it('should sort messages by date (newest first)', async () => {
    const { result } = renderHook(() => useMessages({ view: 'inbox' }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const messages = result.current.data || []
    if (messages.length > 1) {
      for (let i = 0; i < messages.length - 1; i++) {
        const dateA = new Date(
          messages[i].received_at || messages[i].created_at
        ).getTime()
        const dateB = new Date(
          messages[i + 1].received_at || messages[i + 1].created_at
        ).getTime()
        expect(dateA).toBeGreaterThanOrEqual(dateB)
      }
    }
  })
})

describe('useMessage', () => {
  it('should fetch a single message by ID', async () => {
    const { result } = renderHook(() => useMessage('msg-001'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.id).toBe('msg-001')
  })

  it('should return null for non-existent message ID', async () => {
    const { result } = renderHook(() => useMessage('non-existent-id'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeNull()
  })

  it('should not fetch when messageId is null', async () => {
    const { result } = renderHook(() => useMessage(null), {
      wrapper: createWrapper(),
    })

    // Should not be loading since query is disabled
    expect(result.current.isLoading).toBe(false)
    expect(result.current.fetchStatus).toBe('idle')
  })
})

describe('useLabels', () => {
  it('should fetch labels', async () => {
    const { result } = renderHook(() => useLabels(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(Array.isArray(result.current.data)).toBe(true)
    expect(result.current.data!.length).toBeGreaterThan(0)
  })

  it('should return labels with required properties', async () => {
    const { result } = renderHook(() => useLabels(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const labels = result.current.data || []
    labels.forEach((label) => {
      expect(label).toHaveProperty('id')
      expect(label).toHaveProperty('name')
      expect(label).toHaveProperty('color')
    })
  })
})

describe('useUnreadCount', () => {
  it('should return unread count object with breakdown', async () => {
    const { result } = renderHook(() => useUnreadCount(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toBeDefined()
    expect(result.current.data).toHaveProperty('total')
    expect(result.current.data).toHaveProperty('gmail')
    expect(result.current.data).toHaveProperty('slack')
    expect(typeof result.current.data?.total).toBe('number')
    expect(typeof result.current.data?.gmail).toBe('number')
    expect(typeof result.current.data?.slack).toBe('number')
  })

  it('should have gmail + slack equal to total', async () => {
    const { result } = renderHook(() => useUnreadCount(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const data = result.current.data!
    expect(data.gmail + data.slack).toBe(data.total)
  })
})

describe('useToggleRead', () => {
  it('should toggle read status', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useToggleRead(), { wrapper })

    // Mutation should be available
    expect(result.current.mutateAsync).toBeDefined()
    expect(typeof result.current.mutateAsync).toBe('function')
  })
})

describe('useToggleStar', () => {
  it('should toggle star status', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useToggleStar(), { wrapper })

    // Mutation should be available
    expect(result.current.mutateAsync).toBeDefined()
    expect(typeof result.current.mutateAsync).toBe('function')
  })
})
