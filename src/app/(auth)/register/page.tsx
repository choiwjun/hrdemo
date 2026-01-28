'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        setError('이미 등록된 이메일입니다.')
      } else {
        setError('회원가입 중 오류가 발생하였습니다. 다시 시도해 주세요.')
      }
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <CheckCircle className="h-12 w-12 text-success" />
          <h2 className="mt-4 text-xl font-semibold">회원가입 완료</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            입력하신 이메일로 인증 메일을 발송하였습니다.
            <br />
            이메일을 확인하여 인증을 완료해 주세요.
          </p>
          <Button
            className="mt-6"
            onClick={() => router.push('/login')}
          >
            로그인 페이지로 이동
          </Button>
        </CardContent>
      </Card>
    )
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
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              type="text"
              placeholder="이름을 입력하세요"
              autoComplete="name"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호 (8자 이상)"
              autoComplete="new-password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">비밀번호 확인</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-sm text-destructive">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                가입 중...
              </>
            ) : (
              '회원가입'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-primary hover:underline">
              로그인
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
