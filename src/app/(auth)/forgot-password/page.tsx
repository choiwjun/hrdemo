'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null)
    const supabase = createClient()

    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    )

    if (authError) {
      setError('비밀번호 재설정 메일 발송 중 오류가 발생하였습니다.')
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-8 text-center">
          <Mail className="h-12 w-12 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">이메일을 확인해 주세요</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            비밀번호 재설정 링크를 이메일로 발송하였습니다.
            <br />
            이메일을 확인하여 비밀번호를 재설정해 주세요.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              로그인 페이지로 돌아가기
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pt-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold">비밀번호 찾기</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              가입하신 이메일 주소를 입력해 주세요.
            </p>
          </div>

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
                발송 중...
              </>
            ) : (
              '재설정 링크 발송'
            )}
          </Button>

          <Link
            href="/login"
            className="text-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 inline-block h-3 w-3" />
            로그인 페이지로 돌아가기
          </Link>
        </CardFooter>
      </form>
    </Card>
  )
}
