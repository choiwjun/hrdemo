'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Attendance } from '@/types/database'
import attendancesData from '@/mocks/attendances.json'

// Mock 데이터 타입 변환
const mockAttendances: Attendance[] = attendancesData.attendances as Attendance[]

// 오늘 날짜 문자열 (YYYY-MM-DD)
const getTodayString = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

// 이번 주 날짜 범위 계산
const getWeekRange = () => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  const friday = new Date(monday)
  friday.setDate(monday.getDate() + 4)

  return {
    start: monday.toISOString().split('T')[0],
    end: friday.toISOString().split('T')[0],
  }
}

// 현재 사용자 ID (Mock)
const CURRENT_USER_ID = 'user-001'

// 오늘 근태 조회 훅
export function useTodayAttendance() {
  return useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const today = getTodayString()
      return mockAttendances.find((a) => a.work_date === today && a.user_id === CURRENT_USER_ID) || null
    },
    staleTime: 1000 * 30, // 30초간 캐시
  })
}

// 이번 주 근태 목록 조회 훅
export function useWeekAttendances() {
  return useQuery({
    queryKey: ['attendance', 'week'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const { start, end } = getWeekRange()
      return mockAttendances.filter(
        (a) => a.user_id === CURRENT_USER_ID && a.work_date >= start && a.work_date <= end
      ).sort((a, b) => a.work_date.localeCompare(b.work_date))
    },
    staleTime: 1000 * 60, // 1분간 캐시
  })
}

// 월별 근태 목록 조회 훅
export function useMonthAttendances(year: number, month: number) {
  return useQuery({
    queryKey: ['attendance', 'month', year, month],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

      return mockAttendances.filter(
        (a) => a.user_id === CURRENT_USER_ID && a.work_date >= startDate && a.work_date <= endDate
      ).sort((a, b) => a.work_date.localeCompare(b.work_date))
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })
}

// 근태 통계 계산
export function useAttendanceStats(attendances: Attendance[]) {
  const totalDays = attendances.length
  const totalMinutes = attendances.reduce((sum, a) => sum + (a.work_minutes || 0), 0)
  const totalHours = Math.floor(totalMinutes / 60)
  const remainingMinutes = totalMinutes % 60
  const normalDays = attendances.filter((a) => a.status === 'normal').length
  const lateDays = attendances.filter((a) => a.status === 'late').length
  const earlyLeaveDays = attendances.filter((a) => a.status === 'early_leave').length

  return {
    totalDays,
    totalMinutes,
    totalHours,
    remainingMinutes,
    normalDays,
    lateDays,
    earlyLeaveDays,
  }
}

// 출근 처리
export function useClockIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const today = getTodayString()
      const now = new Date().toISOString()

      // Mock: 새 출근 기록 생성
      const newAttendance: Attendance = {
        id: `att-${Date.now()}`,
        user_id: 'user-001',
        work_date: today,
        clock_in: now,
        clock_out: null,
        work_minutes: null,
        status: 'normal',
        note: null,
        created_at: now,
        updated_at: now,
      }

      mockAttendances.push(newAttendance)
      return newAttendance
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}

// 퇴근 처리
export function useClockOut() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const today = getTodayString()
      const now = new Date()

      // Mock: 오늘 출근 기록 찾아서 퇴근 처리
      const attendance = mockAttendances.find((a) => a.work_date === today && a.user_id === CURRENT_USER_ID)
      if (!attendance) {
        throw new Error('오늘 출근 기록이 없습니다.')
      }
      if (attendance.clock_out) {
        throw new Error('이미 퇴근 처리되었습니다.')
      }

      const clockIn = new Date(attendance.clock_in!)
      const workMinutes = Math.floor((now.getTime() - clockIn.getTime()) / (1000 * 60))

      attendance.clock_out = now.toISOString()
      attendance.work_minutes = workMinutes
      attendance.updated_at = now.toISOString()

      return attendance
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
    },
  })
}

// 팀원 오늘 출근 현황 조회 (팀장용)
export function useTeamTodayAttendances() {
  return useQuery({
    queryKey: ['attendance', 'team', 'today'],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const today = getTodayString()
      return mockAttendances.filter((a) => a.work_date === today)
    },
    staleTime: 1000 * 30, // 30초간 캐시
  })
}

// 팀원 월별 근태 조회 (팀장용)
export function useTeamMonthAttendances(year: number, month: number) {
  return useQuery({
    queryKey: ['attendance', 'team', 'month', year, month],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200))
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

      return mockAttendances.filter(
        (a) => a.work_date >= startDate && a.work_date <= endDate
      ).sort((a, b) => a.work_date.localeCompare(b.work_date))
    },
    staleTime: 1000 * 60 * 5, // 5분간 캐시
  })
}
