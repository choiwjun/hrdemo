'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isValidLink, setIsValidLink] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  useEffect(() => {
    // URL에서 토큰 확인 (Supabase가 자동으로 처리)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const errorCode = hashParams.get('error_code')

    if (errorCode) {
      setIsValidLink(false)
    }
  }, [])

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.updateUser({
      password: data.password,
    })

    if (authError) {
      if (authError.message.includes('expired')) {
        setError('비밀번호 재설정 링크가 만료되었습니다. 다시 요청해 주세요.')
      } else {
        setError('비밀번호 변경 중 오류가 발생하였습니다.')
      }
      return
    }

    setSuccess(true)
  }

  if (!isValidLink) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-warning" />
          <h2 className="mt-4 text-xl font-semibold">유효하지 않은 링크입니다</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다.
            <br />
            다시 비밀번호 찾기를 요청해 주세요.
          </p>
          <Button
            className="mt-6"
            onClick={() => router.push('/forgot-password')}
          >
            비밀번호 찾기
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (success) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <CheckCircle className="h-12 w-12 text-success" />
          <h2 className="mt-4 text-xl font-semibold">비밀번호가 변경되었습니다</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            새 비밀번호로 로그인해 주세요.
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
          <div className="text-center">
            <h2 className="text-lg font-semibold">새 비밀번호 설정</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              새로운 비밀번호를 입력해 주세요.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">새 비밀번호</Label>
            <Input
              id="password"
              type="password"
              placeholder="새 비밀번호 (8자 이상)"
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

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                변경 중...
              </>
            ) : (
              '비밀번호 변경'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
