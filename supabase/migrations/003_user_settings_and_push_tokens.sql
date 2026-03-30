alter table public.users
  add column if not exists bio text,
  add column if not exists push_enabled boolean not null default true,
  add column if not exists reminder_push_enabled boolean not null default true,
  add column if not exists update_push_enabled boolean not null default true,
  add column if not exists marketing_push_enabled boolean not null default false;

create table if not exists public.device_push_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token text not null,
  token_type text not null,
  device_name text,
  device_os text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, token)
);
