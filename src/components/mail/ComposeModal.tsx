'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMailStore } from '@/stores/mailStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Send, Save, X } from 'lucide-react'
import { toast } from 'sonner'

// 폼 스키마
const composeSchema = z.object({
  service: z.enum(['gmail', 'slack']),
  to: z.string().min(1, '수신자를 입력하세요'),
  subject: z.string().optional(),
  body: z.string().min(1, '내용을 입력하세요'),
})

type ComposeFormData = z.infer<typeof composeSchema>

export function ComposeModal() {
  const { isComposeOpen, setComposeOpen } = useMailStore()
  const [isSending, setIsSending] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ComposeFormData>({
    resolver: zodResolver(composeSchema),
    defaultValues: {
      service: 'gmail',
      to: '',
      subject: '',
      body: '',
    },
  })

  const selectedService = watch('service')

  const handleClose = () => {
    if (isDirty) {
      const confirmed = window.confirm('작성 중인 내용이 있습니다. 저장하지 않고 닫으시겠습니까?')
      if (!confirmed) return
    }
    reset()
    setComposeOpen(false)
  }

  const onSubmit = async (data: ComposeFormData) => {
    setIsSending(true)
    try {
      // Mock: 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('Sending message:', data)
      toast.success('메시지가 전송되었습니다.')
      reset()
      setComposeOpen(false)
    } catch {
      toast.error('메시지 전송에 실패했습니다.')
    } finally {
      setIsSending(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    try {
      const data = watch()
      // Mock: 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log('Saving draft:', data)
      toast.success('임시저장되었습니다.')
    } catch {
      toast.error('임시저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isComposeOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>새 메시지 작성</DialogTitle>
          <DialogDescription>Gmail 또는 Slack으로 새 메시지를 작성합니다.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 서비스 선택 */}
          <div className="space-y-2">
            <Label htmlFor="service">서비스</Label>
            <Select
              value={selectedService}
              onValueChange={(value: 'gmail' | 'slack') => setValue('service', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="서비스를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="slack">Slack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 수신자 */}
          <div className="space-y-2">
            <Label htmlFor="to">
              {selectedService === 'gmail' ? '받는 사람 (이메일)' : '받는 사람 (Slack 사용자)'}
            </Label>
            <Input
              id="to"
              type={selectedService === 'gmail' ? 'email' : 'text'}
              placeholder={
                selectedService === 'gmail'
                  ? 'example@email.com'
                  : '@사용자명'
              }
              {...register('to')}
            />
            {errors.to && (
              <p className="text-sm text-destructive">{errors.to.message}</p>
            )}
          </div>

          {/* 제목 (Gmail만) */}
          {selectedService === 'gmail' && (
            <div className="space-y-2">
              <Label htmlFor="subject">제목</Label>
              <Input
                id="subject"
                placeholder="메시지 제목을 입력하세요"
                {...register('subject')}
              />
            </div>
          )}

          {/* 본문 */}
          <div className="space-y-2">
            <Label htmlFor="body">내용</Label>
            <Textarea
              id="body"
              placeholder="메시지 내용을 입력하세요"
              rows={8}
              {...register('body')}
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body.message}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving || isSending}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  임시저장
                </>
              )}
            </Button>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSending}
              >
                <X className="mr-2 h-4 w-4" />
                취소
              </Button>
              <Button type="submit" disabled={isSending || isSaving}>
                {isSending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    보내기
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
