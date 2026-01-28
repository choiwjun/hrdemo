'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [authStatus, setAuthStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    // 클라이언트에서 localStorage 체크
    const demoUser = localStorage.getItem('demo_user')
    if (demoUser) {
      setAuthStatus('authenticated')
    } else {
      setAuthStatus('unauthenticated')
      // 약간의 딜레이 후 리다이렉트 (상태 업데이트 보장)
      setTimeout(() => {
        router.replace('/login')
      }, 100)
    }
  }, [router])

  // 로딩 중
  if (authStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // 인증되지 않은 경우 (리다이렉트 중)
  if (authStatus === 'unauthenticated') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">로그인 페이지로 이동 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="lg:pl-60">
        <div className="min-h-[calc(100vh-56px)]">{children}</div>
      </main>
    </div>
  )
}
