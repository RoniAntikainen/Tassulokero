alter table public.pets
  drop column if exists is_public;

alter table public.pet_updates
  drop column if exists visibility;

alter table public.pet_updates
  add column if not exists visibility text not null default 'shared'
  check (visibility in ('shared', 'private'));

alter table public.breeder_links
  drop column if exists breeder_profile_id,
  drop column if exists public_puppy_listing_enabled;

alter table public.breeder_links
  add column if not exists breeder_name text not null default 'Kasvattaja';

drop table if exists public.public_reports cascade;
drop table if exists public.follows cascade;
drop table if exists public.public_likes cascade;
drop table if exists public.public_comments cascade;
drop table if exists public.public_post_links cascade;
drop table if exists public.public_posts cascade;
drop table if exists public.public_profiles cascade;

