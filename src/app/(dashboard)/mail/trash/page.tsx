'use client'

import { Trash2 } from 'lucide-react'

export default function TrashPage() {
  return (
    <div className="flex h-[calc(100vh-56px)] flex-col items-center justify-center text-muted-foreground">
      <Trash2 className="h-12 w-12 mb-4" />
      <h2 className="text-lg font-medium">휴지통</h2>
      <p className="text-sm mt-2">삭제된 메일이 없습니다.</p>
    </div>
  )
}
