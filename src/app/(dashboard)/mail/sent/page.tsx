'use client'

import { Send } from 'lucide-react'

export default function SentPage() {
  return (
    <div className="flex h-[calc(100vh-56px)] flex-col items-center justify-center text-muted-foreground">
      <Send className="h-12 w-12 mb-4" />
      <h2 className="text-lg font-medium">보낸편지함</h2>
      <p className="text-sm mt-2">보낸 메일이 없습니다.</p>
    </div>
  )
}
