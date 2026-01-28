'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Lock, Bell, Palette } from 'lucide-react'

const settingsItems = [
  {
    href: '/settings/profile',
    icon: User,
    title: '프로필 설정',
    description: '이름, 프로필 사진 등 개인 정보를 관리합니다.',
  },
  {
    href: '/settings/password',
    icon: Lock,
    title: '비밀번호 변경',
    description: '계정 비밀번호를 변경합니다.',
  },
  {
    href: '/settings/notifications',
    icon: Bell,
    title: '알림 설정',
    description: '알림 수신 방법을 설정합니다.',
  },
  {
    href: '/settings/appearance',
    icon: Palette,
    title: '화면 설정',
    description: '테마 및 표시 옵션을 설정합니다.',
  },
]

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">설정</h1>
        <p className="text-muted-foreground">계정 및 앱 설정을 관리합니다.</p>
      </div>

      <div className="space-y-4">
        {settingsItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="cursor-pointer transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
