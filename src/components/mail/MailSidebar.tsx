'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useMailStore, type ServiceFilter, type ViewType } from '@/stores/mailStore'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Inbox,
  Send,
  FileEdit,
  Trash2,
  AlertTriangle,
  Star,
  Plus,
  Tag,
  MoreHorizontal,
  Pencil,
  Trash,
} from 'lucide-react'
import type { Label } from '@/types/database'

const viewItems: { view: ViewType; icon: React.ElementType; label: string }[] = [
  { view: 'inbox', icon: Inbox, label: '받은편지함' },
  { view: 'sent', icon: Send, label: '보낸편지함' },
  { view: 'draft', icon: FileEdit, label: '임시보관함' },
  { view: 'starred', icon: Star, label: '별표 표시' },
  { view: 'spam', icon: AlertTriangle, label: '스팸' },
  { view: 'trash', icon: Trash2, label: '휴지통' },
]

const serviceFilters: { filter: ServiceFilter; label: string; color?: string }[] = [
  { filter: 'all', label: '전체' },
  { filter: 'gmail', label: 'Gmail', color: 'bg-red-100 text-red-700' },
  { filter: 'slack', label: 'Slack', color: 'bg-indigo-100 text-indigo-700' },
]

interface MailSidebarProps {
  labels?: Label[]
  onComposeClick?: () => void
  onCreateLabel?: () => void
  onEditLabel?: (label: Label) => void
  onDeleteLabel?: (label: Label) => void
}

export function MailSidebar({
  labels = [],
  onComposeClick,
  onCreateLabel,
  onEditLabel,
  onDeleteLabel,
}: MailSidebarProps) {
  const { activeView, setActiveView, serviceFilter, setServiceFilter, selectedLabelId, setSelectedLabelId } = useMailStore()

  return (
    <div className="flex h-full w-60 flex-col border-r bg-background">
      <div className="p-4">
        <Button className="w-full gap-2" onClick={onComposeClick}>
          <Plus className="h-4 w-4" />
          새 메시지
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        {/* 서비스 필터 */}
        <div className="flex gap-1 pb-3">
          {serviceFilters.map((item) => (
            <Button
              key={item.filter}
              variant={serviceFilter === item.filter ? 'default' : 'ghost'}
              size="sm"
              className={cn(
                'flex-1 text-xs',
                serviceFilter !== item.filter && item.color
              )}
              onClick={() => setServiceFilter(item.filter)}
            >
              {item.label}
            </Button>
          ))}
        </div>

        <Separator className="mb-2" />

        {/* 메일함 뷰 */}
        <div className="space-y-1 py-2">
          {viewItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                setActiveView(item.view)
                setSelectedLabelId(null)
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                activeView === item.view && !selectedLabelId
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </div>

        <Separator className="my-2" />

        {/* 라벨 */}
        <div className="py-2">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-medium text-muted-foreground">라벨</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={onCreateLabel}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="space-y-1">
            {labels.length > 0 ? (
              labels.map((label) => (
                <div
                  key={label.id}
                  className={cn(
                    'group flex items-center justify-between rounded-lg pr-1 transition-colors hover:bg-accent',
                    selectedLabelId === label.id
                      ? 'bg-accent text-accent-foreground'
                      : ''
                  )}
                >
                  <button
                    onClick={() => {
                      setSelectedLabelId(label.id)
                      setActiveView('inbox')
                    }}
                    className={cn(
                      'flex flex-1 items-center gap-3 px-3 py-2 text-sm transition-colors',
                      selectedLabelId === label.id
                        ? 'font-medium'
                        : 'text-muted-foreground'
                    )}
                  >
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: label.color }}
                    />
                    {label.name}
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditLabel?.(label)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDeleteLabel?.(label)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                라벨 없음
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
