create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text unique not null,
  display_name text,
  role_profile text not null default 'owner',
  plan text not null default 'free',
  plan_status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  species text not null,
  breed text,
  sex text,
  birth_date date,
  birth_date_is_estimate boolean not null default false,
  weight_kg numeric(5,2),
  color_markings text,
  chip_id text,
  is_neutered boolean,
  photo_url text,
  notes text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_access (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  role text not null check (role in ('family', 'caretaker')),
  is_admin boolean not null default false,
  can_view_profile boolean not null default true,
  can_edit_profile boolean not null default false,
  can_view_health boolean not null default false,
  can_edit_health boolean not null default false,
  can_view_care_instructions boolean not null default true,
  can_manage_reminders boolean not null default false,
  can_view_reminders boolean not null default false,
  can_view_private_notes boolean not null default false,
  created_at timestamptz not null default now(),
  unique (pet_id, user_id)
);

create table if not exists public.vaccinations (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  vaccine_name text not null,
  administered_on date not null,
  valid_until date,
  clinic_name text,
  veterinarian_name text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  medication_name text not null,
  dosage text,
  instructions text,
  start_date date,
  end_date date,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vet_visits (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  visit_date date not null,
  clinic_name text,
  veterinarian_name text,
  reason text,
  summary text,
  follow_up_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.health_notes (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  type text not null,
  title text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.care_instructions (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  type text not null,
  title text not null,
  content text not null,
  sort_order integer not null default 0,
  is_shared_with_caretakers boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  pet_id uuid not null references public.pets(id) on delete cascade,
  source_type text,
  source_id uuid,
  title text not null,
  description text,
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'cancelled')),
  notify_push boolean not null default true,
  notify_email boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_updates (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  author_user_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  visibility text not null default 'shared' check (visibility in ('shared', 'private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  related_type text not null,
  related_id uuid not null,
  file_url text not null,
  file_name text not null,
  mime_type text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.public_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  profile_type text not null check (profile_type in ('owner', 'breeder')),
  handle text not null unique,
  display_name text not null,
  bio text,
  is_public boolean not null default false,
  comments_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.breeder_links (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  breeder_profile_id uuid not null references public.public_profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  can_view_health boolean not null default true,
  can_edit_heat_cycles boolean not null default true,
  can_view_reminders boolean not null default false,
  public_puppy_listing_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pet_id, breeder_profile_id)
);

create table if not exists public.heat_cycles (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references public.pets(id) on delete cascade,
  started_on date not null,
  ended_on date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.public_posts (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid not null references public.users(id) on delete cascade,
  primary_profile_id uuid references public.public_profiles(id) on delete cascade,
  primary_pet_id uuid references public.pets(id) on delete cascade,
  body text,
  visibility text not null default 'private' check (visibility in ('private', 'public_profile', 'public_extended')),
  comments_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (primary_profile_id is not null or primary_pet_id is not null)
);

create table if not exists public.public_post_links (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.public_posts(id) on delete cascade,
  pet_id uuid references public.pets(id) on delete cascade,
  profile_id uuid references public.public_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (pet_id is not null or profile_id is not null)
);

create table if not exists public.public_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.public_posts(id) on delete cascade,
  author_user_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  status text not null default 'visible' check (status in ('visible', 'hidden', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.public_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.public_posts(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_user_id uuid not null references public.users(id) on delete cascade,
  followed_profile_id uuid references public.public_profiles(id) on delete cascade,
  followed_pet_id uuid references public.pets(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (followed_profile_id is not null or followed_pet_id is not null)
);

create table if not exists public.public_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references public.users(id) on delete cascade,
  post_id uuid references public.public_posts(id) on delete cascade,
  comment_id uuid references public.public_comments(id) on delete cascade,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  check (post_id is not null or comment_id is not null)
);
