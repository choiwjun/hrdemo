'use client'

import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Star, Paperclip } from 'lucide-react'
import type { Message } from '@/types/database'

interface MailListItemProps {
  message: Message
  isSelected: boolean
  isActive: boolean
  onSelect: () => void
  onClick: () => void
  onStarToggle: () => void
}

export function MailListItem({
  message,
  isSelected,
  isActive,
  onSelect,
  onClick,
  onStarToggle,
}: MailListItemProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return '어제'
    } else if (diffDays < 7) {
      return `${diffDays}일 전`
    } else {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div
      className={cn(
        'group flex cursor-pointer items-start gap-3 border-b px-4 py-3 transition-colors hover:bg-muted/50',
        isActive && 'bg-muted',
        !message.is_read && 'bg-primary/5'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 pt-1">
        <Checkbox
          checked={isSelected}
          onClick={(e) => {
            e.stopPropagation()
            onSelect()
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation()
            onStarToggle()
          }}
          className="text-muted-foreground hover:text-yellow-500 transition-colors"
        >
          <Star
            className={cn(
              'h-4 w-4',
              message.is_starred && 'fill-yellow-500 text-yellow-500'
            )}
          />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                'text-xs',
                message.service === 'gmail'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : 'border-indigo-200 bg-indigo-50 text-indigo-700'
              )}
            >
              {message.service === 'gmail' ? 'Gmail' : 'Slack'}
            </Badge>
            <span
              className={cn(
                'truncate text-sm',
                !message.is_read && 'font-semibold'
              )}
            >
              {message.from_address || '알 수 없음'}
            </span>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDate(message.received_at)}
          </span>
        </div>

        <div className="mt-1">
          <p
            className={cn(
              'truncate text-sm',
              !message.is_read ? 'font-medium text-foreground' : 'text-foreground'
            )}
          >
            {message.subject || '(제목 없음)'}
          </p>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <p className="truncate text-xs text-muted-foreground">
            {message.body?.slice(0, 100) || '(내용 없음)'}
          </p>
          {message.attachments && message.attachments.length > 0 && (
            <Paperclip className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  )
}
