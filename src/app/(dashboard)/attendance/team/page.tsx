'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  CalendarDays,
} from 'lucide-react'
import { useTeamTodayAttendances, useTeamMonthAttendances, useAttendanceStats } from '@/hooks/useAttendance'
import { useProfiles, useCurrentProfile } from '@/hooks/useProfiles'
import type { Attendance, Profile } from '@/types/database'

type ViewMode = 'today' | 'month'

export default function TeamAttendancePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('today')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  const { data: currentProfile, isLoading: isLoadingProfile } = useCurrentProfile()
  const { data: profiles = [], isLoading: isLoadingProfiles } = useProfiles()
  const { data: todayAttendances = [], isLoading: isLoadingToday } = useTeamTodayAttendances()
  const { data: monthAttendances = [], isLoading: isLoadingMonth } = useTeamMonthAttendances(
    selectedYear,
    selectedMonth
  )

  // 권한 체크 (manager 또는 admin만 접근 가능)
  const hasAccess = currentProfile?.role === 'manager' || currentProfile?.role === 'admin'

  const getProfileByUserId = (userId: string): Profile | undefined => {
    return profiles.find((p) => p.user_id === userId)
  }

  const getTodayAttendanceForUser = (userId: string): Attendance | undefined => {
    return todayAttendances.find((a) => a.user_id === userId)
  }

  const getStatusBadge = (attendance: Attendance | undefined) => {
    if (!attendance) {
      return (
        <Badge variant="outline" className="gap-1">
          <XCircle className="h-3 w-3" />
          미출근
        </Badge>
      )
    }

    if (attendance.clock_out) {
      return (
        <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3" />
          퇴근
        </Badge>
      )
    }

    if (attendance.status === 'late') {
      return (
        <Badge variant="secondary" className="gap-1 bg-yellow-100 text-yellow-700">
          <AlertTriangle className="h-3 w-3" />
          지각
        </Badge>
      )
    }

    return (
      <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700">
        <Clock className="h-3 w-3" />
        근무 중
      </Badge>
    )
  }

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '-'
    return new Date(isoString).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // 월별 사용자별 통계
  const getUserMonthStats = (userId: string) => {
    const userAttendances = monthAttendances.filter((a) => a.user_id === userId)
    return useAttendanceStats(userAttendances)
  }

  const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-4 h-64 w-full" />
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-semibold">접근 권한이 없습니다</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              이 페이지는 팀장 또는 관리자만 접근할 수 있습니다.
            </p>
            <Link href="/attendance">
              <Button className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                근태 페이지로 돌아가기
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/attendance">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">팀원 근태 현황</h1>
            <p className="text-sm text-muted-foreground">
              팀원들의 출근 현황을 확인합니다.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('today')}
          >
            오늘
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            월별
          </Button>
        </div>
      </div>

      {viewMode === 'today' ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              오늘 출근 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingToday || isLoadingProfiles ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {profiles.map((profile) => {
                  const attendance = getTodayAttendanceForUser(profile.user_id)
                  return (
                    <div
                      key={profile.user_id}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                          {profile.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{profile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {profile.role === 'manager'
                              ? '팀장'
                              : profile.role === 'admin'
                                ? '관리자'
                                : '팀원'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <p className="text-muted-foreground">
                            출근: {formatTime(attendance?.clock_in || null)}
                          </p>
                          <p className="text-muted-foreground">
                            퇴근: {formatTime(attendance?.clock_out || null)}
                          </p>
                        </div>
                        {getStatusBadge(attendance)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="mb-6">
            <CardContent className="flex items-center gap-4 py-4">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <Select
                  value={String(selectedYear)}
                  onValueChange={(v) => setSelectedYear(Number(v))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}년
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={String(selectedMonth)}
                  onValueChange={(v) => setSelectedMonth(Number(v))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={String(month)}>
                        {month}월
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {selectedYear}년 {selectedMonth}월 근태 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingMonth || isLoadingProfiles ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              ) : (
                <div className="divide-y">
                  {profiles.map((profile) => {
                    const stats = getUserMonthStats(profile.user_id)
                    return (
                      <div key={profile.user_id} className="py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-medium text-primary">
                              {profile.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{profile.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {profile.role === 'manager'
                                  ? '팀장'
                                  : profile.role === 'admin'
                                    ? '관리자'
                                    : '팀원'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="ml-13 grid grid-cols-4 gap-4 pl-13 ml-[52px]">
                          <div className="rounded-lg bg-muted/50 p-3 text-center">
                            <p className="text-2xl font-bold">{stats.totalDays}</p>
                            <p className="text-xs text-muted-foreground">근무일</p>
                          </div>
                          <div className="rounded-lg bg-green-50 p-3 text-center">
                            <p className="text-2xl font-bold text-green-600">
                              {stats.normalDays}
                            </p>
                            <p className="text-xs text-muted-foreground">정상</p>
                          </div>
                          <div className="rounded-lg bg-yellow-50 p-3 text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                              {stats.lateDays}
                            </p>
                            <p className="text-xs text-muted-foreground">지각</p>
                          </div>
                          <div className="rounded-lg bg-orange-50 p-3 text-center">
                            <p className="text-2xl font-bold text-orange-600">
                              {stats.earlyLeaveDays}
                            </p>
                            <p className="text-xs text-muted-foreground">조퇴</p>
                          </div>
                        </div>
                        <div className="ml-[52px] mt-2 text-sm text-muted-foreground">
                          총 근무시간: {stats.totalHours}시간 {stats.remainingMinutes}분
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
