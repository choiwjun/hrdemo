'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Mail,
  Calendar,
  Clock,
  ArrowRight,
  Inbox,
  CheckCircle,
  XCircle,
  PlayCircle,
} from 'lucide-react'
import { useUnreadCount } from '@/hooks/useMessages'
import { useTodayEvents } from '@/hooks/useEvents'
import { useTodayAttendance } from '@/hooks/useAttendance'
import { useCurrentProfile } from '@/hooks/useProfiles'

export default function DashboardPage() {
  const { data: profile } = useCurrentProfile()
  const { data: unreadData, isLoading: isLoadingUnread } = useUnreadCount()
  const { data: todayEvents = [], isLoading: isLoadingEvents } = useTodayEvents()
  const { data: todayAttendance, isLoading: isLoadingAttendance } = useTodayAttendance()

  const getAttendanceStatus = () => {
    if (!todayAttendance) {
      return {
        icon: <XCircle className="h-5 w-5 text-muted-foreground" />,
        text: '출근 전',
        subText: '출근 기록이 없습니다',
      }
    }

    if (todayAttendance.clock_out) {
      return {
        icon: <CheckCircle className="h-5 w-5 text-success" />,
        text: '퇴근 완료',
        subText: `근무시간: ${Math.floor((todayAttendance.work_minutes || 0) / 60)}시간 ${(todayAttendance.work_minutes || 0) % 60}분`,
      }
    }

    const clockIn = new Date(todayAttendance.clock_in!)
    const clockInTime = clockIn.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    return {
      icon: <PlayCircle className="h-5 w-5 text-primary" />,
      text: '근무 중',
      subText: `출근: ${clockInTime}`,
    }
  }

  const getNextEvent = () => {
    if (todayEvents.length === 0) return null

    const now = new Date()
    const futureEvents = todayEvents.filter((e) => new Date(e.start_at) > now)

    if (futureEvents.length === 0) return null

    const nextEvent = futureEvents[0]
    const startTime = new Date(nextEvent.start_at).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })

    return `다음 일정: ${startTime} ${nextEvent.title}`
  }

  const attendanceStatus = getAttendanceStatus()
  const nextEvent = getNextEvent()

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          안녕하세요{profile ? `, ${profile.name}님` : ''}!
        </h1>
        <p className="text-muted-foreground">오늘의 업무 현황을 확인하세요.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* 미읽은 메시지 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">미읽은 메시지</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingUnread ? (
              <>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-1 h-4 w-24" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{unreadData?.total || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Gmail {unreadData?.gmail || 0} · Slack {unreadData?.slack || 0}
                </p>
              </>
            )}
            <Link href="/mail">
              <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                메일함 확인하기
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 오늘 일정 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">오늘 일정</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingEvents ? (
              <>
                <Skeleton className="h-8 w-8" />
                <Skeleton className="mt-1 h-4 w-32" />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">{todayEvents.length}</div>
                <p className="text-xs text-muted-foreground">
                  {nextEvent || '오늘 남은 일정이 없습니다'}
                </p>
              </>
            )}
            <Link href="/calendar">
              <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                캘린더 확인하기
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 근태 현황 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">근태 현황</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoadingAttendance ? (
              <>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="mt-1 h-4 w-20" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {attendanceStatus.icon}
                  <span className="text-lg font-medium">{attendanceStatus.text}</span>
                </div>
                <p className="text-xs text-muted-foreground">{attendanceStatus.subText}</p>
              </>
            )}
            <Link href="/attendance">
              <Button variant="link" className="mt-2 h-auto p-0 text-primary">
                근태 기록하기
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* 오늘 일정 목록 */}
      {todayEvents.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold">오늘의 일정</h2>
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {todayEvents.slice(0, 5).map((event) => {
                  const startTime = new Date(event.start_at).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                  const endTime = new Date(event.end_at).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })

                  return (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 rounded-lg border-l-4 bg-muted/30 p-3"
                      style={{ borderLeftColor: event.color }}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.is_all_day ? '종일' : `${startTime} - ${endTime}`}
                        </p>
                      </div>
                    </div>
                  )
                })}
                {todayEvents.length > 5 && (
                  <p className="text-center text-sm text-muted-foreground">
                    +{todayEvents.length - 5}개의 일정이 더 있습니다
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 빠른 작업 */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-semibold">빠른 작업</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/mail">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Inbox className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">메일 확인</p>
                  <p className="text-xs text-muted-foreground">받은 편지함 열기</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/mail?compose=true">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">메시지 작성</p>
                  <p className="text-xs text-muted-foreground">새 메시지 보내기</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/calendar">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">일정 추가</p>
                  <p className="text-xs text-muted-foreground">새 일정 등록하기</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/attendance">
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {todayAttendance?.clock_out
                      ? '근태 확인'
                      : todayAttendance?.clock_in
                        ? '퇴근 기록'
                        : '출근 기록'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {todayAttendance?.clock_out
                      ? '오늘 근무 기록 보기'
                      : todayAttendance?.clock_in
                        ? '퇴근 시간 기록하기'
                        : '출근 시간 기록하기'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
