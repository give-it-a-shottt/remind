-- remind 기기 간 동기화용 테이블
-- Supabase 대시보드 → SQL Editor 에 붙여 넣고 Run 한다. 여러 번 실행해도 안전하다.

-- 사용자당 한 줄. data 에는 학습 기록 JSON 전체 (풀던 세트 session 은 기기마다 따로라 제외)
create table if not exists public.progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

-- 보안 규칙(RLS): 로그인한 사람은 "자기 줄"만 읽고 쓸 수 있다
alter table public.progress enable row level security;

drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own" on public.progress
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own" on public.progress
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own" on public.progress
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 로그인한 사용자 역할에만 권한. 로그인 안 한 요청(anon)은 이 테이블을 못 본다
revoke all on public.progress from anon;
grant select, insert, update on public.progress to authenticated;
