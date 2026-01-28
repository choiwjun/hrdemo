import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, Calendar, Clock, LayoutDashboard } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">팀메이트</h1>
          <div className="flex gap-2">
            <Link href="/login">
              <Button variant="ghost">로그인</Button>
            </Link>
            <Link href="/register">
              <Button>시작하기</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            가벼운 그룹웨어,
            <br />
            <span className="text-blue-600">팀메이트</span>
          </h2>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
            여러 툴을 오가는 피로감을 줄여주는 통합 그룹웨어
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="px-8">
                무료로 시작하기
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8">
                로그인
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid max-w-4xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">통합 메일함</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Gmail과 Slack을 한 곳에서
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">근태 관리</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              출퇴근 기록 및 현황 조회
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">팀 캘린더</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              일정 관리 및 참석자 초대
            </p>
          </div>

          <div className="flex flex-col items-center rounded-lg border bg-white p-6 text-center shadow-sm dark:bg-zinc-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <LayoutDashboard className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">대시보드</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              오늘의 모든 정보를 한눈에
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-zinc-500">
        © 2025 팀메이트. All rights reserved.
      </footer>
    </div>
  )
}
