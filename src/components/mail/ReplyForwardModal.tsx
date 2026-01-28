'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Loader2, Send, X, Reply, Forward } from 'lucide-react'
import { toast } from 'sonner'
import type { Message } from '@/types/database'

// 폼 스키마
const replyForwardSchema = z.object({
  to: z.string().min(1, '수신자를 입력하세요'),
  subject: z.string().optional(),
  body: z.string().min(1, '내용을 입력하세요'),
})

type ReplyForwardFormData = z.infer<typeof replyForwardSchema>

type ModalMode = 'reply' | 'forward'

interface ReplyForwardModalProps {
  open: boolean
  mode: ModalMode
  originalMessage: Message | null
  onClose: () => void
  onSend?: (data: ReplyForwardFormData) => Promise<void>
}

export function ReplyForwardModal({
  open,
  mode,
  originalMessage,
  onClose,
  onSend,
}: ReplyForwardModalProps) {
  const [isSending, setIsSending] = useState(false)

  const isReply = mode === 'reply'
  const title = isReply ? '답장' : '전달'
  const Icon = isReply ? Reply : Forward

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyForwardFormData>({
    resolver: zodResolver(replyForwardSchema),
    defaultValues: {
      to: '',
      subject: '',
      body: '',
    },
  })

  // 모달이 열릴 때 초기값 설정
  useEffect(() => {
    if (open && originalMessage) {
      const isReplyMode = mode === 'reply'

      // 제목 생성
      let subject = ''
      if (originalMessage.subject) {
        const prefix = isReplyMode ? 'Re: ' : 'Fwd: '
        subject = originalMessage.subject.startsWith(prefix)
          ? originalMessage.subject
          : prefix + originalMessage.subject
      }

      // 인용 본문 생성
      const fromAddress = originalMessage.from_address || '알 수 없음'
      const date = originalMessage.received_at
        ? new Date(originalMessage.received_at).toLocaleString('ko-KR')
        : ''
      const body = originalMessage.body || ''

      const quotedBody = isReplyMode
        ? `\n\n\n---\n${date}에 ${fromAddress}님이 작성:\n\n> ${body.split('\n').join('\n> ')}`
        : `\n\n\n---------- 전달된 메시지 ----------\n보낸 사람: ${fromAddress}\n날짜: ${date}\n제목: ${originalMessage.subject || '(제목 없음)'}\n\n${body}`

      reset({
        to: isReplyMode ? (originalMessage.from_address || '') : '',
        subject,
        body: quotedBody,
      })
    }
  }, [open, originalMessage, mode, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: ReplyForwardFormData) => {
    setIsSending(true)
    try {
      if (onSend) {
        await onSend(data)
      } else {
        // Mock: 실제로는 API 호출
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      toast.success(isReply ? '답장이 전송되었습니다.' : '메시지가 전달되었습니다.')
      handleClose()
    } catch {
      toast.error(isReply ? '답장 전송에 실패했습니다.' : '메시지 전달에 실패했습니다.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {isReply ? '원본 메시지에 답장합니다.' : '메시지를 다른 수신자에게 전달합니다.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 수신자 */}
          <div className="space-y-2">
            <Label htmlFor="to">받는 사람</Label>
            <Input
              id="to"
              type={originalMessage?.service === 'gmail' ? 'email' : 'text'}
              placeholder={
                originalMessage?.service === 'gmail'
                  ? 'example@email.com'
                  : '@사용자명'
              }
              {...register('to')}
              disabled={isReply}
            />
            {errors.to && (
              <p className="text-sm text-destructive">{errors.to.message}</p>
            )}
          </div>

          {/* 제목 (Gmail만) */}
          {originalMessage?.service === 'gmail' && (
            <div className="space-y-2">
              <Label htmlFor="subject">제목</Label>
              <Input
                id="subject"
                placeholder="메시지 제목"
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
              rows={12}
              {...register('body')}
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body.message}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isSending}
            >
              <X className="mr-2 h-4 w-4" />
              취소
            </Button>
            <Button type="submit" disabled={isSending}>
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
        </form>
      </DialogContent>
    </Dialog>
  )
}
