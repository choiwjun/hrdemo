'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Inbox,
  Send,
  FileEdit,
  Trash2,
  AlertTriangle,
  Star,
  Calendar,
  Clock,
  Settings,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

const mainNavItems = [
  { href: '/mail', icon: Inbox, label: '받은편지함' },
  { href: '/mail/sent', icon: Send, label: '보낸편지함' },
  { href: '/mail/drafts', icon: FileEdit, label: '임시보관함' },
  { href: '/mail/starred', icon: Star, label: '별표 표시' },
  { href: '/mail/spam', icon: AlertTriangle, label: '스팸' },
  { href: '/mail/trash', icon: Trash2, label: '휴지통' },
]

const featureNavItems = [
  { href: '/attendance', icon: Clock, label: '근태 관리' },
  { href: '/calendar', icon: Calendar, label: '캘린더' },
]

const bottomNavItems = [
  { href: '/settings', icon: Settings, label: '설정' },
]

export function Sidebar({ open = true, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* 모바일 오버레이 */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={cn(
          'fixed left-0 top-14 z-50 flex h-[calc(100vh-56px)] w-60 flex-col border-r bg-background transition-transform lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold">메뉴</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <Separator className="my-2" />

          <div className="space-y-1 py-2">
            {featureNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                  pathname.startsWith(item.href)
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <Separator className="my-2" />

          {/* 라벨 영역 (추후 데이터 연결) */}
          <div className="py-2">
            <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
              라벨
            </p>
            <div className="space-y-1">
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                중요
              </div>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                업무
              </div>
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                개인
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="border-t p-3">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent',
                pathname.startsWith(item.href)
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      </aside>
    </>
  )
}
