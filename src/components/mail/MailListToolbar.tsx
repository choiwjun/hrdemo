'use client'

import { useState, useEffect, useCallback } from 'react'
import { useMailStore } from '@/stores/mailStore'
import { useBulkToggleRead, useBulkDelete } from '@/hooks/useMessages'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  RefreshCw,
  Mail,
  MailOpen,
  Trash2,
  Tag,
  ChevronDown,
  Search,
  X,
} from 'lucide-react'

interface MailListToolbarProps {
  onRefresh?: () => void
  totalMessages?: number
}

// 디바운스 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function MailListToolbar({ onRefresh, totalMessages = 0 }: MailListToolbarProps) {
  const {
    selectedMessageIds,
    searchQuery,
    selectAllMessages,
    clearSelection,
    setSearchQuery,
    setSelectedMessageIds,
  } = useMailStore()

  // 로컬 검색 입력 상태
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const debouncedSearch = useDebounce(localSearch, 300)

  // 뮤테이션 훅
  const bulkToggleReadMutation = useBulkToggleRead()
  const bulkDeleteMutation = useBulkDelete()

  // 디바운스된 검색어를 스토어에 반영
  useEffect(() => {
    setSearchQuery(debouncedSearch)
  }, [debouncedSearch, setSearchQuery])

  // 외부에서 searchQuery가 변경되면 로컬 상태 동기화
  useEffect(() => {
    if (searchQuery !== localSearch) {
      setLocalSearch(searchQuery)
    }
  }, [searchQuery])

  const hasSelection = selectedMessageIds.length > 0
  const allSelected = selectedMessageIds.length === totalMessages && totalMessages > 0
  const someSelected = selectedMessageIds.length > 0 && selectedMessageIds.length < totalMessages

  const handleSelectAll = () => {
    if (allSelected || someSelected) {
      clearSelection()
    } else {
      selectAllMessages()
    }
  }

  const handleMarkAsRead = () => {
    bulkToggleReadMutation.mutate({ messageIds: selectedMessageIds, isRead: true })
    clearSelection()
  }

  const handleMarkAsUnread = () => {
    bulkToggleReadMutation.mutate({ messageIds: selectedMessageIds, isRead: false })
    clearSelection()
  }

  const handleDelete = () => {
    bulkDeleteMutation.mutate(selectedMessageIds)
    clearSelection()
  }

  const handleClearSearch = () => {
    setLocalSearch('')
    setSearchQuery('')
  }

  return (
    <div className="space-y-2 border-b px-4 py-2">
      {/* 검색 바 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="메시지 검색..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-9 pr-9"
        />
        {localSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* 툴바 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            ref={(el) => {
              if (el) {
                (el as unknown as HTMLInputElement).indeterminate = someSelected
              }
            }}
            onClick={handleSelectAll}
          />

          {hasSelection ? (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedMessageIds.length}개 선택됨
              </span>
              <div className="ml-2 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleMarkAsRead}
                  title="읽음으로 표시"
                  disabled={bulkToggleReadMutation.isPending}
                >
                  <MailOpen className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleMarkAsUnread}
                  title="읽지 않음으로 표시"
                  disabled={bulkToggleReadMutation.isPending}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" title="라벨">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>중요</DropdownMenuItem>
                    <DropdownMenuItem>업무</DropdownMenuItem>
                    <DropdownMenuItem>개인</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={handleDelete}
                  title="삭제"
                  disabled={bulkDeleteMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-1">
                    전체
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={selectAllMessages}>전체 선택</DropdownMenuItem>
                  <DropdownMenuItem>읽지 않은 메시지</DropdownMenuItem>
                  <DropdownMenuItem>별표 표시</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {searchQuery && (
                <span className="text-sm text-muted-foreground">
                  &quot;{searchQuery}&quot; 검색 결과
                </span>
              )}
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onRefresh}
          title="새로고침"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
