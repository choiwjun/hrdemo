-- ==============================================
-- 팀메이트 데이터베이스 스키마
-- 버전: v1.0
-- 작성일: 2025-01-28
-- ==============================================

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- 1. profiles 테이블 (사용자 프로필)
-- ==============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'manager', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- RLS 정책
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- ==============================================
-- 2. labels 테이블 (라벨)
-- ==============================================
CREATE TABLE IF NOT EXISTS labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(20) DEFAULT '#6B7280',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, name)
);

CREATE INDEX idx_labels_user_id ON labels(user_id);

-- RLS 정책
ALTER TABLE labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own labels"
ON labels FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own labels"
ON labels FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own labels"
ON labels FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own labels"
ON labels FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ==============================================
-- 3. messages 테이블 (통합 메시지)
-- ==============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service VARCHAR(10) NOT NULL CHECK (service IN ('gmail', 'slack')),
  message_type VARCHAR(10) NOT NULL CHECK (message_type IN ('received', 'sent', 'draft')),
  recipient_type VARCHAR(10) CHECK (recipient_type IN ('to', 'cc', 'bcc', 'mention')),
  external_id VARCHAR(255),
  thread_id VARCHAR(255),
  subject VARCHAR(500),
  body TEXT,
  from_address VARCHAR(255),
  to_addresses JSONB DEFAULT '[]',
  cc_addresses JSONB DEFAULT '[]',
  bcc_addresses JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT FALSE,
  is_starred BOOLEAN DEFAULT FALSE,
  is_spam BOOLEAN DEFAULT FALSE,
  is_trash BOOLEAN DEFAULT FALSE,
  attachments JSONB DEFAULT '[]',
  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_service ON messages(service);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_received_at ON messages(received_at DESC);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_deleted_at ON messages(deleted_at) WHERE deleted_at IS NULL;

-- RLS 정책
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
ON messages FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can insert own messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
ON messages FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages"
ON messages FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ==============================================
-- 4. message_labels 테이블 (메시지-라벨 연결)
-- ==============================================
CREATE TABLE IF NOT EXISTS message_labels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (message_id, label_id)
);

CREATE INDEX idx_message_labels_message_id ON message_labels(message_id);
CREATE INDEX idx_message_labels_label_id ON message_labels(label_id);

-- RLS 정책
ALTER TABLE message_labels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own message_labels"
ON message_labels FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM messages
    WHERE messages.id = message_labels.message_id
    AND messages.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own message_labels"
ON message_labels FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM messages
    WHERE messages.id = message_labels.message_id
    AND messages.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own message_labels"
ON message_labels FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM messages
    WHERE messages.id = message_labels.message_id
    AND messages.user_id = auth.uid()
  )
);

-- ==============================================
-- 5. attendances 테이블 (근태 기록)
-- ==============================================
CREATE TABLE IF NOT EXISTS attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  work_date DATE NOT NULL,
  clock_in TIMESTAMPTZ,
  clock_out TIMESTAMPTZ,
  work_minutes INTEGER,
  status VARCHAR(20) DEFAULT 'normal' CHECK (status IN ('normal', 'late', 'early_leave', 'absent')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, work_date)
);

CREATE INDEX idx_attendances_user_id ON attendances(user_id);
CREATE INDEX idx_attendances_work_date ON attendances(work_date DESC);
CREATE INDEX idx_attendances_user_date ON attendances(user_id, work_date);

-- RLS 정책
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own attendance"
ON attendances FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attendance"
ON attendances FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attendance"
ON attendances FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- 매니저가 팀원 근태 조회 가능 (추후 팀 구조 추가 시)
-- CREATE POLICY "Managers can view team attendance"
-- ON attendances FOR SELECT
-- TO authenticated
-- USING (
--   auth.uid() = user_id
--   OR EXISTS (
--     SELECT 1 FROM profiles
--     WHERE profiles.user_id = auth.uid()
--     AND profiles.role IN ('manager', 'admin')
--   )
-- );

-- ==============================================
-- 6. events 테이블 (일정)
-- ==============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  is_all_day BOOLEAN DEFAULT FALSE,
  color VARCHAR(20) DEFAULT '#3B82F6',
  recurrence VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_events_date_range ON events(start_at, end_at);

-- RLS 정책
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events"
ON events FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND deleted_at IS NULL);

CREATE POLICY "Users can view events they participate in"
ON events FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM event_participants
    WHERE event_participants.event_id = events.id
    AND event_participants.user_id = auth.uid()
  )
  AND deleted_at IS NULL
);

CREATE POLICY "Users can insert own events"
ON events FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
ON events FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
ON events FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ==============================================
-- 7. event_participants 테이블 (일정 참석자)
-- ==============================================
CREATE TABLE IF NOT EXISTS event_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (event_id, user_id)
);

CREATE INDEX idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX idx_event_participants_user_id ON event_participants(user_id);

-- RLS 정책
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view event participants"
ON event_participants FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_participants.event_id
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Event creators can insert participants"
ON event_participants FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_participants.event_id
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own participation"
ON event_participants FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Event creators can delete participants"
ON event_participants FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM events
    WHERE events.id = event_participants.event_id
    AND events.user_id = auth.uid()
  )
);

-- ==============================================
-- 8. 트리거 및 함수
-- ==============================================

-- 프로필 자동 생성 트리거
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    'member'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 각 테이블에 updated_at 트리거 적용
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_labels_updated_at
  BEFORE UPDATE ON labels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at
  BEFORE UPDATE ON attendances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_participants_updated_at
  BEFORE UPDATE ON event_participants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- 9. 출퇴근 기록 함수
-- ==============================================

-- 출근 기록 함수
CREATE OR REPLACE FUNCTION clock_in(p_user_id UUID)
RETURNS attendances AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_now TIMESTAMPTZ := NOW();
  v_record attendances;
BEGIN
  -- 오늘 기록이 이미 있는지 확인
  SELECT * INTO v_record
  FROM attendances
  WHERE user_id = p_user_id AND work_date = v_today;

  IF v_record.id IS NOT NULL THEN
    RAISE EXCEPTION 'Already clocked in today';
  END IF;

  -- 새 출근 기록 생성
  INSERT INTO attendances (user_id, work_date, clock_in, status)
  VALUES (p_user_id, v_today, v_now, 'normal')
  RETURNING * INTO v_record;

  RETURN v_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 퇴근 기록 함수
CREATE OR REPLACE FUNCTION clock_out(p_user_id UUID)
RETURNS attendances AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_now TIMESTAMPTZ := NOW();
  v_record attendances;
  v_work_minutes INTEGER;
BEGIN
  -- 오늘 출근 기록 확인
  SELECT * INTO v_record
  FROM attendances
  WHERE user_id = p_user_id AND work_date = v_today;

  IF v_record.id IS NULL THEN
    RAISE EXCEPTION 'No clock-in record found for today';
  END IF;

  IF v_record.clock_out IS NOT NULL THEN
    RAISE EXCEPTION 'Already clocked out today';
  END IF;

  -- 근무 시간 계산 (분 단위)
  v_work_minutes := EXTRACT(EPOCH FROM (v_now - v_record.clock_in)) / 60;

  -- 퇴근 기록 업데이트
  UPDATE attendances
  SET clock_out = v_now,
      work_minutes = v_work_minutes,
      updated_at = v_now
  WHERE id = v_record.id
  RETURNING * INTO v_record;

  RETURN v_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
