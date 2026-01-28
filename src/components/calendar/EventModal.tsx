'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Loader2, X, Users, Check, Clock, XCircle } from 'lucide-react'
import { useCreateEvent, useUpdateEvent } from '@/hooks/useEvents'
import { useTeamMembers } from '@/hooks/useProfiles'
import {
  useEventParticipants,
  useAddParticipant,
  useRemoveParticipant,
} from '@/hooks/useEventParticipants'
import { toast } from 'sonner'
import type { Event } from '@/types/database'

const eventSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요'),
  description: z.string().optional(),
  start_date: z.string().min(1, '시작 날짜를 선택해주세요'),
  start_time: z.string().optional(),
  end_date: z.string().min(1, '종료 날짜를 선택해주세요'),
  end_time: z.string().optional(),
  is_all_day: z.boolean(),
  color: z.string(),
})

type EventFormData = z.infer<typeof eventSchema>

const colorOptions = [
  { value: '#3b82f6', label: '파랑' },
  { value: '#10b981', label: '초록' },
  { value: '#f59e0b', label: '주황' },
  { value: '#ef4444', label: '빨강' },
  { value: '#8b5cf6', label: '보라' },
  { value: '#ec4899', label: '분홍' },
  { value: '#6b7280', label: '회색' },
]

interface EventModalProps {
  open: boolean
  onClose: () => void
  event: Event | null
  selectedDate: Date | null
}

export function EventModal({ open, onClose, event, selectedDate }: EventModalProps) {
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  const createEventMutation = useCreateEvent()
  const updateEventMutation = useUpdateEvent()
  const addParticipantMutation = useAddParticipant()
  const removeParticipantMutation = useRemoveParticipant()

  const { data: teamMembers = [] } = useTeamMembers()
  const { data: existingParticipants = [] } = useEventParticipants(event?.id || null)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      start_date: '',
      start_time: '09:00',
      end_date: '',
      end_time: '18:00',
      is_all_day: false,
      color: '#3b82f6',
    },
  })

  const isAllDay = watch('is_all_day')
  const selectedColor = watch('color')

  useEffect(() => {
    if (open) {
      if (event) {
        // 수정 모드
        const startAt = new Date(event.start_at)
        const endAt = new Date(event.end_at)

        reset({
          title: event.title,
          description: event.description || '',
          start_date: startAt.toISOString().split('T')[0],
          start_time: event.is_all_day ? '09:00' : startAt.toTimeString().slice(0, 5),
          end_date: endAt.toISOString().split('T')[0],
          end_time: event.is_all_day ? '18:00' : endAt.toTimeString().slice(0, 5),
          is_all_day: event.is_all_day,
          color: event.color,
        })

        // 기존 참석자 로드
        setSelectedParticipants(existingParticipants.map((p) => p.user_id))
      } else if (selectedDate) {
        // 생성 모드
        const dateString = selectedDate.toISOString().split('T')[0]
        reset({
          title: '',
          description: '',
          start_date: dateString,
          start_time: '09:00',
          end_date: dateString,
          end_time: '18:00',
          is_all_day: false,
          color: '#3b82f6',
        })
        setSelectedParticipants([])
      }
    }
  }, [open, event, selectedDate, reset, existingParticipants])

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Check className="h-3 w-3 text-green-500" />
      case 'declined':
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return <Clock className="h-3 w-3 text-yellow-500" />
    }
  }

  const onSubmit = async (data: EventFormData) => {
    try {
      const startAt = data.is_all_day
        ? new Date(`${data.start_date}T00:00:00`).toISOString()
        : new Date(`${data.start_date}T${data.start_time}`).toISOString()

      const endAt = data.is_all_day
        ? new Date(`${data.end_date}T23:59:59`).toISOString()
        : new Date(`${data.end_date}T${data.end_time}`).toISOString()

      const eventData = {
        title: data.title,
        description: data.description || null,
        start_at: startAt,
        end_at: endAt,
        is_all_day: data.is_all_day,
        color: data.color,
        recurrence: null,
      }

      if (event) {
        await updateEventMutation.mutateAsync({
          eventId: event.id,
          updates: eventData,
        })

        // 참석자 업데이트
        const existingUserIds = existingParticipants.map((p) => p.user_id)
        const toAdd = selectedParticipants.filter((id) => !existingUserIds.includes(id))
        const toRemove = existingUserIds.filter((id) => !selectedParticipants.includes(id))

        if (toAdd.length > 0) {
          await addParticipantMutation.mutateAsync({
            eventId: event.id,
            userIds: toAdd,
          })
        }

        for (const userId of toRemove) {
          await removeParticipantMutation.mutateAsync({
            eventId: event.id,
            userId,
          })
        }

        toast.success('일정이 수정되었습니다.')
      } else {
        const newEvent = await createEventMutation.mutateAsync(eventData)

        // 참석자 추가
        if (selectedParticipants.length > 0) {
          await addParticipantMutation.mutateAsync({
            eventId: newEvent.id,
            userIds: selectedParticipants,
          })
        }

        toast.success('일정이 추가되었습니다.')
      }

      onClose()
    } catch {
      toast.error(event ? '일정 수정에 실패했습니다.' : '일정 추가에 실패했습니다.')
    }
  }

  const isPending =
    createEventMutation.isPending ||
    updateEventMutation.isPending ||
    addParticipantMutation.isPending ||
    removeParticipantMutation.isPending

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? '일정 수정' : '새 일정'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="일정 제목을 입력하세요"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              placeholder="일정에 대한 설명을 입력하세요"
              rows={3}
              {...register('description')}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_all_day"
              checked={isAllDay}
              onCheckedChange={(checked) => setValue('is_all_day', !!checked)}
            />
            <Label htmlFor="is_all_day" className="cursor-pointer">
              종일 일정
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">시작 날짜</Label>
              <Input id="start_date" type="date" {...register('start_date')} />
              {errors.start_date && (
                <p className="text-sm text-destructive">{errors.start_date.message}</p>
              )}
            </div>
            {!isAllDay && (
              <div className="space-y-2">
                <Label htmlFor="start_time">시작 시간</Label>
                <Input id="start_time" type="time" {...register('start_time')} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="end_date">종료 날짜</Label>
              <Input id="end_date" type="date" {...register('end_date')} />
              {errors.end_date && (
                <p className="text-sm text-destructive">{errors.end_date.message}</p>
              )}
            </div>
            {!isAllDay && (
              <div className="space-y-2">
                <Label htmlFor="end_time">종료 시간</Label>
                <Input id="end_time" type="time" {...register('end_time')} />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>색상</Label>
            <div className="flex gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`h-8 w-8 rounded-full transition-transform ${
                    selectedColor === color.value
                      ? 'ring-2 ring-offset-2 ring-primary scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => setValue('color', color.value)}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              참석자
            </Label>
            {selectedParticipants.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedParticipants.map((userId) => {
                  const member = teamMembers.find((m) => m.user_id === userId)
                  const existingParticipant = existingParticipants.find(
                    (p) => p.user_id === userId
                  )
                  return (
                    <Badge key={userId} variant="secondary" className="gap-1">
                      {existingParticipant && getStatusIcon(existingParticipant.status)}
                      {member?.name || '알 수 없음'}
                      <button
                        type="button"
                        onClick={() => toggleParticipant(userId)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                })}
              </div>
            )}
            <div className="border rounded-md p-2 max-h-32 overflow-y-auto">
              {teamMembers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  팀원이 없습니다.
                </p>
              ) : (
                <div className="space-y-1">
                  {teamMembers.map((member) => (
                    <button
                      key={member.user_id}
                      type="button"
                      onClick={() => toggleParticipant(member.user_id)}
                      className={`w-full flex items-center justify-between p-2 rounded text-sm hover:bg-muted transition-colors ${
                        selectedParticipants.includes(member.user_id)
                          ? 'bg-primary/10'
                          : ''
                      }`}
                    >
                      <span>{member.name}</span>
                      {selectedParticipants.includes(member.user_id) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
