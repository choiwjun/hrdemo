'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Reply,
  Forward,
  Trash2,
  Star,
  Tag,
  MoreVertical,
  X,
  Paperclip,
  Mail,
  ArrowLeft,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Message } from '@/types/database'

interface MailDetailProps {
  message: Message | null
  onClose?: () => void
  onBack?: () => void
  onReply?: () => void
  onForward?: () => void
  onDelete?: () => void
  onStarToggle?: () => void
}

export function MailDetail({
  message,
  onClose,
  onBack,
  onReply,
  onForward,
  onDelete,
  onStarToggle,
}: MailDetailProps) {
  if (!message) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Mail className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-medium">메시지를 선택해 주세요</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          왼쪽 목록에서 메시지를 선택하면 여기에 표시됩니다.
        </p>
      </div>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} title="목록으로" className="lg:hidden">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onReply} title="답장">
            <Reply className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onForward} title="전달">
            <Forward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onStarToggle}
            title="별표"
          >
            <Star
              className={cn(
                'h-4 w-4',
                message.is_starred && 'fill-yellow-500 text-yellow-500'
              )}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title="라벨">
                <Tag className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>중요</DropdownMenuItem>
              <DropdownMenuItem>업무</DropdownMenuItem>
              <DropdownMenuItem>개인</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            title="삭제"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>스팸으로 신고</DropdownMenuItem>
              <DropdownMenuItem>인쇄</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 본문 */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* 제목 */}
          <div className="flex items-start gap-3">
            <Badge
              variant="outline"
              className={cn(
                'mt-1',
                message.service === 'gmail'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-indigo-200 bg-indigo-50 text-indigo-700'
              )}
            >
              {message.service === 'gmail' ? 'Gmail' : 'Slack'}
            </Badge>
            <div>
              <h2 className="text-xl font-semibold">
                {message.subject || '(제목 없음)'}
              </h2>
            </div>
          </div>

          <Separator className="my-4" />

          {/* 발신자 정보 */}
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>
                {message.from_address?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{message.from_address || '알 수 없음'}</p>
                  <p className="text-sm text-muted-foreground">
                    받는 사람: {message.to_addresses?.join(', ') || '나'}
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(message.received_at)}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          {/* 본문 내용 */}
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.body || '(내용 없음)'}
            </div>
          </div>

          {/* 첨부파일 */}
          {message.attachments && message.attachments.length > 0 && (
            <>
              <Separator className="my-4" />
              <div>
                <h3 className="mb-2 text-sm font-medium">
                  첨부파일 ({message.attachments.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {message.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{attachment.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(attachment.size / 1024)}KB)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
