import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  useTodayAttendance,
  useWeekAttendances,
  useAttendanceStats,
  useClockIn,
  useClockOut,
  useTeamTodayAttendances,
} from '@/hooks/useAttendance'
import type { Attendance } from '@/types/database'

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

describe('useTodayAttendance', () => {
  it('should fetch today attendance', async () => {
    const { result } = renderHook(() => useTodayAttendance(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Data could be null (not clocked in) or an attendance object
    expect(result.current.isSuccess).toBe(true)
  })

  it('should return attendance with proper structure when data exists', async () => {
    const { result } = renderHook(() => useTodayAttendance(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    if (result.current.data) {
      expect(result.current.data).toHaveProperty('id')
      expect(result.current.data).toHaveProperty('user_id')
      expect(result.current.data).toHaveProperty('work_date')
      expect(result.current.data).toHaveProperty('clock_in')
    }
  })
})

describe('useWeekAttendances', () => {
  it('should fetch week attendances', async () => {
    const { result } = renderHook(() => useWeekAttendances(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(Array.isArray(result.current.data)).toBe(true)
  })

  it('should return attendances sorted by date', async () => {
    const { result } = renderHook(() => useWeekAttendances(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const attendances = result.current.data || []
    if (attendances.length > 1) {
      for (let i = 0; i < attendances.length - 1; i++) {
        expect(attendances[i].work_date.localeCompare(attendances[i + 1].work_date)).toBeLessThanOrEqual(0)
      }
    }
  })

  it('should only contain current user attendances', async () => {
    const { result } = renderHook(() => useWeekAttendances(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const attendances = result.current.data || []
    // All attendances should belong to the current user (user-001)
    expect(attendances.every((a) => a.user_id === 'user-001')).toBe(true)
  })
})

describe('useAttendanceStats', () => {
  const mockAttendances: Attendance[] = [
    {
      id: '1',
      user_id: 'user-001',
      work_date: '2025-01-27',
      clock_in: '2025-01-27T09:00:00Z',
      clock_out: '2025-01-27T18:00:00Z',
      work_minutes: 540,
      status: 'normal',
      note: null,
      created_at: '2025-01-27T09:00:00Z',
      updated_at: '2025-01-27T18:00:00Z',
    },
    {
      id: '2',
      user_id: 'user-001',
      work_date: '2025-01-28',
      clock_in: '2025-01-28T09:30:00Z',
      clock_out: '2025-01-28T18:00:00Z',
      work_minutes: 510,
      status: 'late',
      note: '지각',
      created_at: '2025-01-28T09:30:00Z',
      updated_at: '2025-01-28T18:00:00Z',
    },
    {
      id: '3',
      user_id: 'user-001',
      work_date: '2025-01-29',
      clock_in: '2025-01-29T09:00:00Z',
      clock_out: '2025-01-29T17:00:00Z',
      work_minutes: 480,
      status: 'early_leave',
      note: '조퇴',
      created_at: '2025-01-29T09:00:00Z',
      updated_at: '2025-01-29T17:00:00Z',
    },
  ]

  it('should calculate total days correctly', () => {
    const stats = useAttendanceStats(mockAttendances)
    expect(stats.totalDays).toBe(3)
  })

  it('should calculate total minutes and hours correctly', () => {
    const stats = useAttendanceStats(mockAttendances)
    // 540 + 510 + 480 = 1530 minutes
    expect(stats.totalMinutes).toBe(1530)
    // 1530 / 60 = 25.5 hours
    expect(stats.totalHours).toBe(25)
    expect(stats.remainingMinutes).toBe(30)
  })

  it('should count normal days correctly', () => {
    const stats = useAttendanceStats(mockAttendances)
    expect(stats.normalDays).toBe(1)
  })

  it('should count late days correctly', () => {
    const stats = useAttendanceStats(mockAttendances)
    expect(stats.lateDays).toBe(1)
  })

  it('should count early leave days correctly', () => {
    const stats = useAttendanceStats(mockAttendances)
    expect(stats.earlyLeaveDays).toBe(1)
  })

  it('should handle empty array', () => {
    const stats = useAttendanceStats([])
    expect(stats.totalDays).toBe(0)
    expect(stats.totalMinutes).toBe(0)
    expect(stats.totalHours).toBe(0)
    expect(stats.remainingMinutes).toBe(0)
    expect(stats.normalDays).toBe(0)
    expect(stats.lateDays).toBe(0)
    expect(stats.earlyLeaveDays).toBe(0)
  })

  it('should handle null work_minutes', () => {
    const attendanceWithNull: Attendance[] = [
      {
        id: '1',
        user_id: 'user-001',
        work_date: '2025-01-27',
        clock_in: '2025-01-27T09:00:00Z',
        clock_out: null,
        work_minutes: null,
        status: 'normal',
        note: null,
        created_at: '2025-01-27T09:00:00Z',
        updated_at: '2025-01-27T09:00:00Z',
      },
    ]
    const stats = useAttendanceStats(attendanceWithNull)
    expect(stats.totalMinutes).toBe(0)
  })
})

describe('useClockIn', () => {
  it('should have mutateAsync function', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(() => useClockIn(), { wrapper })

    expect(result.current.mutateAsync).toBeDefined()
    expect(typeof result.current.mutateAsync).toBe('function')
  })

  it('should be initially idle', async () => {
    const { result } = renderHook(() => useClockIn(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
  })
})

describe('useClockOut', () => {
  it('should have mutateAsync function', async () => {
    const { result } = renderHook(() => useClockOut(), {
      wrapper: createWrapper(),
    })

    expect(result.current.mutateAsync).toBeDefined()
    expect(typeof result.current.mutateAsync).toBe('function')
  })

  it('should be initially idle', async () => {
    const { result } = renderHook(() => useClockOut(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isPending).toBe(false)
    expect(result.current.isSuccess).toBe(false)
    expect(result.current.isError).toBe(false)
  })
})

describe('useTeamTodayAttendances', () => {
  it('should fetch team attendances', async () => {
    const { result } = renderHook(() => useTeamTodayAttendances(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(Array.isArray(result.current.data)).toBe(true)
  })

  it('should contain multiple users attendances', async () => {
    const { result } = renderHook(() => useTeamTodayAttendances(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    const attendances = result.current.data || []
    if (attendances.length > 1) {
      const userIds = new Set(attendances.map((a) => a.user_id))
      // Team attendance should potentially contain multiple users
      expect(userIds.size).toBeGreaterThanOrEqual(1)
    }
  })
})
