'use client'

import { FileEdit } from 'lucide-react'

export default function DraftsPage() {
  return (
    <div className="flex h-[calc(100vh-56px)] flex-col items-center justify-center text-muted-foreground">
      <FileEdit className="h-12 w-12 mb-4" />
      <h2 className="text-lg font-medium">임시보관함</h2>
      <p className="text-sm mt-2">임시 저장된 메일이 없습니다.</p>
    </div>
  )
}
