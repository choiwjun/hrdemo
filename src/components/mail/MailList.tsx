'use client'

import { useMailStore } from '@/stores/mailStore'
import { useToggleStar, useToggleRead } from '@/hooks/useMessages'
import { MailListItem } from './MailListItem'
import { MailListToolbar } from './MailListToolbar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Inbox, SearchX } from 'lucide-react'
import type { Message } from '@/types/database'

interface MailListProps {
  messages: Message[]
  isLoading?: boolean
  onRefresh?: () => void
}

export function MailList({ messages, isLoading = false, onRefresh }: MailListProps) {
  const {
    selectedMessageIds,
    activeMessageId,
    searchQuery,
    toggleMessageSelection,
    setActiveMessageId,
  } = useMailStore()

  // 뮤테이션 훅
  const toggleStarMutation = useToggleStar()
  const toggleReadMutation = useToggleRead()

  const handleStarToggle = (message: Message) => {
    toggleStarMutation.mutate({
      messageId: message.id,
      isStarred: !message.is_starred,
    })
  }

  const handleMessageClick = (message: Message) => {
    setActiveMessageId(message.id)
    // 읽지 않은 메시지를 클릭하면 읽음 처리
    if (!message.is_read) {
      toggleReadMutation.mutate({
        messageId: message.id,
        isRead: true,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <MailListToolbar onRefresh={onRefresh} totalMessages={0} />
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
              <Skeleton className="h-4 w-4" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col">
        <MailListToolbar onRefresh={onRefresh} totalMessages={0} />
        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          {searchQuery ? (
            <>
              <SearchX className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">검색 결과가 없습니다</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다.
              </p>
            </>
          ) : (
            <>
              <Inbox className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">표시할 메시지가 없습니다</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                새로운 메시지가 도착하면 여기에 표시됩니다.
              </p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <MailListToolbar onRefresh={onRefresh} totalMessages={messages.length} />
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {messages.map((message) => (
            <MailListItem
              key={message.id}
              message={message}
              isSelected={selectedMessageIds.includes(message.id)}
              isActive={activeMessageId === message.id}
              onSelect={() => toggleMessageSelection(message.id)}
              onClick={() => handleMessageClick(message)}
              onStarToggle={() => handleStarToggle(message)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
