'use client'

import { AlertTriangle } from 'lucide-react'

export default function SpamPage() {
  return (
    <div className="flex h-[calc(100vh-56px)] flex-col items-center justify-center text-muted-foreground">
      <AlertTriangle className="h-12 w-12 mb-4" />
      <h2 className="text-lg font-medium">스팸</h2>
      <p className="text-sm mt-2">스팸 메일이 없습니다.</p>
    </div>
  )
}
