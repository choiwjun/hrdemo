'use client'

import { useState } from 'react'
import { useMailStore } from '@/stores/mailStore'
import { useMessages, useLabels, useToggleStar, useDeleteMessage } from '@/hooks/useMessages'
import { MailSidebar, MailList, MailDetail, ComposeModal, LabelModal, ReplyForwardModal } from '@/components/mail'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Label, Message } from '@/types/database'

type ReplyForwardMode = 'reply' | 'forward'

export default function MailPage() {
  const {
    activeMessageId,
    serviceFilter,
    activeView,
    searchQuery,
    setActiveMessageId,
    setComposeOpen,
  } = useMailStore()

  // 라벨 모달 상태
  const [labelModalOpen, setLabelModalOpen] = useState(false)
  const [editingLabel, setEditingLabel] = useState<Label | null>(null)

  // 답장/전달 모달 상태
  const [replyForwardModalOpen, setReplyForwardModalOpen] = useState(false)
  const [replyForwardMode, setReplyForwardMode] = useState<ReplyForwardMode>('reply')

  // 메시지 및 라벨 데이터 로드
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = useMessages({
    service: serviceFilter,
    view: activeView,
    search: searchQuery,
  })

  const { data: labels = [], isLoading: labelsLoading, refetch: refetchLabels } = useLabels()

  // 뮤테이션 훅
  const toggleStarMutation = useToggleStar()
  const deleteMutation = useDeleteMessage()

  // 활성 메시지
  const activeMessage = messages.find((m) => m.id === activeMessageId) || null

  // 별표 토글 핸들러
  const handleStarToggle = () => {
    if (activeMessage) {
      toggleStarMutation.mutate({
        messageId: activeMessage.id,
        isStarred: !activeMessage.is_starred,
      })
    }
  }

  // 삭제 핸들러
  const handleDelete = () => {
    if (activeMessage) {
      deleteMutation.mutate({ messageId: activeMessage.id })
      setActiveMessageId(null)
    }
  }

  // 새 메시지 작성
  const handleCompose = () => {
    setComposeOpen(true)
  }

  // 답장
  const handleReply = () => {
    if (activeMessage) {
      setReplyForwardMode('reply')
      setReplyForwardModalOpen(true)
    }
  }

  // 전달
  const handleForward = () => {
    if (activeMessage) {
      setReplyForwardMode('forward')
      setReplyForwardModalOpen(true)
    }
  }

  // 라벨 생성
  const handleCreateLabel = () => {
    setEditingLabel(null)
    setLabelModalOpen(true)
  }

  // 라벨 수정
  const handleEditLabel = (label: Label) => {
    setEditingLabel(label)
    setLabelModalOpen(true)
  }

  // 라벨 삭제
  const handleDeleteLabel = async (label: Label) => {
    const confirmed = window.confirm(`"${label.name}" 라벨을 삭제하시겠습니까?`)
    if (!confirmed) return

    try {
      // Mock: 실제로는 API 호출
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success('라벨이 삭제되었습니다.')
      refetchLabels()
    } catch {
      toast.error('라벨 삭제에 실패했습니다.')
    }
  }

  // 라벨 저장
  const handleSaveLabel = async (data: { name: string; color: string }) => {
    // Mock: 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 500))
    refetchLabels()
  }

  // 라벨 삭제 (모달에서)
  const handleDeleteLabelFromModal = async (labelId: string) => {
    // Mock: 실제로는 API 호출
    await new Promise((resolve) => setTimeout(resolve, 500))
    refetchLabels()
  }

  // 새로고침
  const handleRefresh = () => {
    refetchMessages()
    toast.success('새로고침 완료')
  }

  // 로딩 상태
  if (messagesLoading || labelsLoading) {
    return (
      <div className="flex h-[calc(100vh-56px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <div className="flex h-[calc(100vh-56px)]">
        {/* 메일 사이드바 (데스크톱에서만 표시) */}
        <div className="hidden border-r xl:block">
          <MailSidebar
            labels={labels}
            onComposeClick={handleCompose}
            onCreateLabel={handleCreateLabel}
            onEditLabel={handleEditLabel}
            onDeleteLabel={handleDeleteLabel}
          />
        </div>

        {/* 메시지 목록 - 모바일에서 메시지 선택 시 숨김 */}
        <div className={`flex-1 border-r ${activeMessage ? 'hidden lg:block' : ''}`}>
          <MailList messages={messages} onRefresh={handleRefresh} />
        </div>

        {/* 메시지 상세 - 모바일에서 메시지 선택 시 전체 화면 */}
        <div className={`${activeMessage ? 'flex-1' : 'hidden'} lg:block lg:w-1/2 lg:flex-none`}>
          <MailDetail
            message={activeMessage}
            onStarToggle={handleStarToggle}
            onDelete={handleDelete}
            onReply={handleReply}
            onForward={handleForward}
            onBack={() => setActiveMessageId(null)}
          />
        </div>
      </div>

      {/* 새 메시지 작성 모달 */}
      <ComposeModal />

      {/* 라벨 관리 모달 */}
      <LabelModal
        open={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        label={editingLabel}
        onSave={handleSaveLabel}
        onDelete={handleDeleteLabelFromModal}
      />

      {/* 답장/전달 모달 */}
      <ReplyForwardModal
        open={replyForwardModalOpen}
        mode={replyForwardMode}
        originalMessage={activeMessage}
        onClose={() => setReplyForwardModalOpen(false)}
      />
    </>
  )
}
