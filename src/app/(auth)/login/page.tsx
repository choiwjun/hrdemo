'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, UserCircle } from 'lucide-react'

// Demo user for testing without Supabase
const DEMO_USER = {
  id: 'user-001',
  email: 'demo@teammate.com',
  name: '김지민',
  role: 'member',
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/mail'
  const [error, setError] = useState<string | null>(null)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleDemoLogin = async () => {
    setIsDemoLoading(true)
    setError(null)

    // Store demo user in localStorage
    localStorage.setItem('demo_user', JSON.stringify(DEMO_USER))

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300))

    // Full page navigation to ensure fresh state
    window.location.href = redirectTo
  }

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      if (authError.message === 'Invalid login credentials') {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      } else if (authError.message === 'Email not confirmed') {
        setError('이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요.')
      } else {
        setError('로그인 중 오류가 발생하였습니다. 다시 시도해 주세요.')
      }
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">비밀번호</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                비밀번호 찾기
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting || isDemoLoading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              '로그인'
            )}
          </Button>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleDemoLogin}
            disabled={isSubmitting || isDemoLoading}
          >
            {isDemoLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                데모 로그인 중...
              </>
            ) : (
              <>
                <UserCircle className="mr-2 h-4 w-4" />
                데모 계정으로 시작하기
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{' '}
            <Link href="/register" className="text-primary hover:underline">
              회원가입
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}

function LoginFormSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}
