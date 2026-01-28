'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'

// SSR-safe useLayoutEffect
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // 클라이언트 마운트 확인
  useIsomorphicLayoutEffect(() => {
    setIsClient(true)
  }, [])

  // 인증 체크 - isClient가 true가 된 후에만 실행
  useEffect(() => {
    if (!isClient) return

    const demoUser = localStorage.getItem('demo_user')
    if (demoUser) {
      setIsAuthenticated(true)
    } else {
      window.location.href = '/login'
    }
  }, [isClient])

  // 클라이언트가 아니거나 인증되지 않은 경우 로딩 표시
  if (!isClient || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
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
