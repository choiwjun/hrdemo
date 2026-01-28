'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Loader2, Trash2 } from 'lucide-react'
import { useEvents, useCreateEvent, useDeleteEvent } from '@/hooks/useEvents'
import { EventModal } from '@/components/calendar/EventModal'
import { toast } from 'sonner'
import type { Event } from '@/types/database'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // 현재 월의 이벤트 조회
  const { data: events = [], isLoading } = useEvents({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
  })

  const createEventMutation = useCreateEvent()
  const deleteEventMutation = useDeleteEvent()

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // 이전 달의 빈 칸
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // 현재 달의 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const days = getDaysInMonth(currentDate)

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    const dateString = date.toISOString().split('T')[0]
    return events.filter((event) => {
      const eventDate = new Date(event.start_at).toISOString().split('T')[0]
      return eventDate === dateString
    })
  }

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : []

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setEventModalOpen(true)
  }

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event)
    setEventModalOpen(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    const confirmed = window.confirm('이 일정을 삭제하시겠습니까?')
    if (!confirmed) return

    try {
      await deleteEventMutation.mutateAsync(eventId)
      toast.success('일정이 삭제되었습니다.')
    } catch {
      toast.error('일정 삭제에 실패했습니다.')
    }
  }

  const formatEventTime = (event: Event) => {
    if (event.is_all_day) return '종일'
    const start = new Date(event.start_at).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const end = new Date(event.end_at).toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    })
    return `${start} - ${end}`
  }

  return (
    <>
      <div className="container mx-auto max-w-6xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">캘린더</h1>
          <Button onClick={handleAddEvent}>
            <Plus className="mr-2 h-4 w-4" />
            일정 추가
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* 캘린더 */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {currentDate.toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={goToNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-16" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1">
                  {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                  {days.map((date, index) => {
                    const dayEvents = getEventsForDate(date)
                    return (
                      <button
                        key={index}
                        className={`relative min-h-16 rounded-lg p-1 text-sm transition-colors hover:bg-muted ${
                          !date ? 'cursor-default' : ''
                        } ${isSelected(date) ? 'bg-primary/10 ring-2 ring-primary' : ''} ${
                          isToday(date) ? 'font-bold' : ''
                        }`}
                        onClick={() => date && setSelectedDate(date)}
                        disabled={!date}
                      >
                        {date && (
                          <>
                            <span
                              className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                                isToday(date) ? 'bg-primary text-primary-foreground' : ''
                              }`}
                            >
                              {date.getDate()}
                            </span>
                            <div className="mt-1 space-y-0.5">
                              {dayEvents.slice(0, 2).map((event) => (
                                <div
                                  key={event.id}
                                  className="truncate rounded px-1 text-xs text-white"
                                  style={{ backgroundColor: event.color }}
                                >
                                  {event.title}
                                </div>
                              ))}
                              {dayEvents.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{dayEvents.length - 2}
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 선택된 날짜의 일정 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {selectedDate
                  ? selectedDate.toLocaleDateString('ko-KR', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long',
                    })
                  : '날짜 선택'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group rounded-lg border-l-4 bg-muted/50 p-3"
                      style={{ borderLeftColor: event.color }}
                    >
                      <div className="flex items-start justify-between">
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => handleEditEvent(event)}
                        >
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatEventTime(event)}
                          </p>
                          {event.description && (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteEvent(event.id)}
                          disabled={deleteEventMutation.isPending}
                        >
                          {deleteEventMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    이 날짜에 등록된 일정이 없습니다.
                  </p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={handleAddEvent}>
                    <Plus className="mr-2 h-4 w-4" />
                    일정 추가
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 일정 추가/수정 모달 */}
      <EventModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        event={selectedEvent}
        selectedDate={selectedDate}
      />
    </>
  )
}
