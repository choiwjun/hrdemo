'use client'

import { Star } from 'lucide-react'

export default function StarredPage() {
  return (
    <div className="flex h-[calc(100vh-56px)] flex-col items-center justify-center text-muted-foreground">
      <Star className="h-12 w-12 mb-4" />
      <h2 className="text-lg font-medium">별표 표시</h2>
      <p className="text-sm mt-2">별표 표시된 메일이 없습니다.</p>
    </div>
  )
}
