'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Label as LabelType } from '@/types/database'

// 색상 옵션
const colorOptions = [
  { value: '#EF4444', name: '빨강' },
  { value: '#F59E0B', name: '주황' },
  { value: '#10B981', name: '초록' },
  { value: '#3B82F6', name: '파랑' },
  { value: '#8B5CF6', name: '보라' },
  { value: '#EC4899', name: '분홍' },
  { value: '#6B7280', name: '회색' },
]

// 폼 스키마
const labelSchema = z.object({
  name: z.string().min(1, '라벨 이름을 입력하세요').max(50, '최대 50자까지 입력 가능합니다'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, '유효한 색상을 선택하세요'),
})

type LabelFormData = z.infer<typeof labelSchema>

interface LabelModalProps {
  open: boolean
  onClose: () => void
  label?: LabelType | null
  onSave: (data: { name: string; color: string }) => Promise<void>
  onDelete?: (labelId: string) => Promise<void>
}

export function LabelModal({ open, onClose, label, onSave, onDelete }: LabelModalProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  const isEditing = !!label

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LabelFormData>({
    resolver: zodResolver(labelSchema),
    defaultValues: {
      name: '',
      color: '#3B82F6',
    },
  })

  const selectedColor = watch('color')

  // 편집 시 폼 초기화
  useEffect(() => {
    if (label) {
      reset({
        name: label.name,
        color: label.color,
      })
    } else {
      reset({
        name: '',
        color: '#3B82F6',
      })
    }
  }, [label, reset])

  const handleClose = () => {
    reset()
    onClose()
  }

  const onSubmit = async (data: LabelFormData) => {
    setIsSaving(true)
    try {
      await onSave(data)
      toast.success(isEditing ? '라벨이 수정되었습니다.' : '라벨이 생성되었습니다.')
      handleClose()
    } catch {
      toast.error(isEditing ? '라벨 수정에 실패했습니다.' : '라벨 생성에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!label || !onDelete) return

    setIsDeleting(true)
    try {
      await onDelete(label.id)
      toast.success('라벨이 삭제되었습니다.')
      setShowDeleteAlert(false)
      handleClose()
    } catch {
      toast.error('라벨 삭제에 실패했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? '라벨 수정' : '새 라벨 만들기'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? '라벨의 이름과 색상을 수정합니다.'
                : '메시지를 분류할 새 라벨을 만듭니다.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 라벨 이름 */}
            <div className="space-y-2">
              <Label htmlFor="name">라벨 이름</Label>
              <Input
                id="name"
                placeholder="라벨 이름을 입력하세요"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* 색상 선택 */}
            <div className="space-y-2">
              <Label>색상</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      selectedColor === color.value
                        ? 'border-foreground scale-110'
                        : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setValue('color', color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              {errors.color && (
                <p className="text-sm text-destructive">{errors.color.message}</p>
              )}
            </div>

            {/* 미리보기 */}
            <div className="space-y-2">
              <Label>미리보기</Label>
              <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-sm font-medium">
                  {watch('name') || '라벨 이름'}
                </span>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-between pt-4">
              {isEditing && onDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteAlert(true)}
                  disabled={isSaving || isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </Button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isSaving}
                >
                  취소
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      저장 중...
                    </>
                  ) : (
                    isEditing ? '수정' : '만들기'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>라벨을 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 라벨을 삭제하면 메시지에서 라벨 연결이 해제됩니다.
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  삭제 중...
                </>
              ) : (
                '삭제'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
