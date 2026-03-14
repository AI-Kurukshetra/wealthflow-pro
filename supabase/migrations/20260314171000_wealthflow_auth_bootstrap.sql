create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    email = excluded.email;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.create_owner_membership_for_organization()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.created_by is not null then
    insert into public.organization_memberships (
      organization_id,
      user_id,
      role,
      status,
      joined_at,
      created_by
    )
    values (
      new.id,
      new.created_by,
      'owner',
      'active',
      timezone('utc', now()),
      new.created_by
    )
    on conflict (organization_id, user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists organizations_create_owner_membership on public.organizations;

create trigger organizations_create_owner_membership
after insert on public.organizations
for each row execute function public.create_owner_membership_for_organization();
