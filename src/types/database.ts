export interface User {
  id: string
  email: string
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  name: string
  avatar_url: string | null
  role: 'member' | 'manager' | 'admin'
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  user_id: string
  service: 'gmail' | 'slack'
  message_type: 'received' | 'sent' | 'draft'
  recipient_type: 'to' | 'cc' | 'bcc' | 'mention' | null
  external_id: string | null
  thread_id: string | null
  subject: string | null
  body: string | null
  from_address: string | null
  to_addresses: string[]
  cc_addresses: string[]
  bcc_addresses: string[]
  is_read: boolean
  is_starred: boolean
  is_spam: boolean
  is_trash: boolean
  attachments: Attachment[]
  received_at: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Attachment {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface Label {
  id: string
  user_id: string
  name: string
  color: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MessageLabel {
  id: string
  message_id: string
  label_id: string
  created_at: string
}

export interface Attendance {
  id: string
  user_id: string
  work_date: string
  clock_in: string | null
  clock_out: string | null
  work_minutes: number | null
  status: 'normal' | 'late' | 'early_leave' | 'absent'
  note: string | null
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  user_id: string
  title: string
  description: string | null
  start_at: string
  end_at: string
  is_all_day: boolean
  color: string
  recurrence: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface EventParticipant {
  id: string
  event_id: string
  user_id: string
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
  updated_at: string
}
