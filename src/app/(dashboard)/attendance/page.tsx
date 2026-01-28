'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Play, Square, Clock, Calendar, CheckCircle, AlertCircle, Loader2, Users } from 'lucide-react'
import { useTodayAttendance, useWeekAttendances, useClockIn, useClockOut, useAttendanceStats } from '@/hooks/useAttendance'
import { useCurrentProfile } from '@/hooks/useProfiles'
import { toast } from 'sonner'

export default function AttendancePage() {
  const { data: todayAttendance, isLoading: todayLoading } = useTodayAttendance()
  const { data: weekAttendances = [], isLoading: weekLoading } = useWeekAttendances()
  const { data: currentProfile } = useCurrentProfile()
  const clockInMutation = useClockIn()
  const clockOutMutation = useClockOut()

  const weekStats = useAttendanceStats(weekAttendances)
  const isManager = currentProfile?.role === 'manager' || currentProfile?.role === 'admin'

  // 현재 상태 계산
  const getStatus = () => {
    if (!todayAttendance) return 'not_started'
    if (!todayAttendance.clock_out) return 'working'
    return 'finished'
  }

  const status = getStatus()

  const handleClockIn = async () => {
    try {
      await clockInMutation.mutateAsync()
      toast.success('출근 처리되었습니다.')
    } catch {
      toast.error('출근 처리에 실패했습니다.')
    }
  }

  const handleClockOut = async () => {
    try {
      await clockOutMutation.mutateAsync()
      toast.success('퇴근 처리되었습니다.')
    } catch {
      toast.error('퇴근 처리에 실패했습니다.')
    }
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '--:--'
    const date = new Date(dateString)
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatWorkTime = (minutes: number | null) => {
    if (!minutes) return '-- 시간 -- 분'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  }

  const today = new Date()

  const getStatusBadge = (attendanceStatus: string) => {
    switch (attendanceStatus) {
      case 'normal':
        return <Badge variant="outline">정상</Badge>
      case 'late':
        return <Badge variant="destructive">지각</Badge>
      case 'early_leave':
        return <Badge className="bg-yellow-500">조퇴</Badge>
      case 'absent':
        return <Badge variant="destructive">결근</Badge>
      default:
        return <Badge variant="secondary">-</Badge>
    }
  }

  // 이번 주 날짜 생성 (월~금)
  const getWeekDates = () => {
    const dayOfWeek = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))

    const dates = []
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates()
  const dayNames = ['월', '화', '수', '목', '금']

  if (todayLoading) {
    return (
      <div className="container mx-auto max-w-2xl p-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">근태 관리</h1>
          <Skeleton className="mx-auto mt-2 h-4 w-48" />
        </div>
        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">근태 관리</h1>
            <p className="text-muted-foreground">
              {today.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </p>
          </div>
          {isManager && (
            <Link href="/attendance/team">
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                팀원 현황
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* 현재 상태 카드 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            오늘의 근무
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4 py-4">
            {status === 'not_started' && (
              <div className="text-center">
                <Badge variant="secondary" className="mb-4">
                  출근 전
                </Badge>
                <div>
                  <Button
                    size="lg"
                    className="w-48"
                    onClick={handleClockIn}
                    disabled={clockInMutation.isPending}
                  >
                    {clockInMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        처리 중...
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        출근하기
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {status === 'working' && (
              <div className="text-center">
                <Badge className="mb-4 bg-success">근무 중</Badge>
                <div className="mb-4 text-sm text-muted-foreground">
                  출근 시간: {formatTime(todayAttendance?.clock_in ?? null)}
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-48"
                  onClick={handleClockOut}
                  disabled={clockOutMutation.isPending}
                >
                  {clockOutMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <Square className="mr-2 h-5 w-5" />
                      퇴근하기
                    </>
                  )}
                </Button>
              </div>
            )}

            {status === 'finished' && (
              <div className="text-center">
                <Badge variant="outline" className="mb-4">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  퇴근 완료
                </Badge>
                <div className="space-y-1 text-sm">
                  <p>출근: {formatTime(todayAttendance?.clock_in ?? null)}</p>
                  <p>퇴근: {formatTime(todayAttendance?.clock_out ?? null)}</p>
                  <p className="font-medium">
                    근무 시간: {formatWorkTime(todayAttendance?.work_minutes ?? null)}
                  </p>
                  {todayAttendance?.status !== 'normal' && (
                    <div className="mt-2">
                      {getStatusBadge(todayAttendance?.status || '')}
                      {todayAttendance?.note && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {todayAttendance.note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 이번 주 근무 현황 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            이번 주 근무 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weekLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {weekDates.map((date, index) => {
                  const dateString = date.toISOString().split('T')[0]
                  const attendance = weekAttendances.find((a) => a.work_date === dateString)
                  const isToday = dateString === today.toISOString().split('T')[0]
                  const isFuture = date > today

                  return (
                    <div
                      key={dateString}
                      className={`flex items-center justify-between rounded-lg px-4 py-2 ${
                        isToday ? 'bg-primary/10 ring-1 ring-primary' : 'bg-muted/50'
                      }`}
                    >
                      <span className="font-medium">
                        {dayNames[index]}요일
                        {isToday && (
                          <span className="ml-2 text-xs text-primary">(오늘)</span>
                        )}
                      </span>
                      <div className="flex items-center gap-4 text-sm">
                        {isFuture ? (
                          <span className="text-muted-foreground">-</span>
                        ) : attendance ? (
                          <>
                            <span className="text-muted-foreground">
                              {formatTime(attendance.clock_in)} -{' '}
                              {attendance.clock_out
                                ? formatTime(attendance.clock_out)
                                : '근무중'}
                            </span>
                            <Badge variant="outline">
                              {formatWorkTime(attendance.work_minutes)}
                            </Badge>
                          </>
                        ) : (
                          <span className="text-muted-foreground">미출근</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 flex justify-between border-t pt-4 text-sm">
                <span className="font-medium">이번 주 총 근무 시간</span>
                <span className="font-bold">
                  {weekStats.totalHours}시간 {weekStats.remainingMinutes}분
                </span>
              </div>
              {(weekStats.lateDays > 0 || weekStats.earlyLeaveDays > 0) && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  {weekStats.lateDays > 0 && `지각 ${weekStats.lateDays}회`}
                  {weekStats.lateDays > 0 && weekStats.earlyLeaveDays > 0 && ', '}
                  {weekStats.earlyLeaveDays > 0 && `조퇴 ${weekStats.earlyLeaveDays}회`}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
