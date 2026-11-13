create table technicians(id serial primary key, name text unique not null, phone text);
insert into technicians(name,phone) values('Ali','60121110001'),('John','60121110002'),('Bala','60121110003'),('Yusoff','60121110004');
create sequence order_seq start 1001;
create table orders(
  id uuid primary key default gen_random_uuid(),
  order_no text unique not null default ('ORDER'||nextval('order_seq')),
  customer_name text not null, phone text not null, address text not null, problem text,
  service_type text, quoted_price numeric default 0,
  technician text references technicians(name), admin_notes text,
  status text not null default 'New' check (status in ('New','Assigned','In Progress','Job Done','Reviewed','Closed')),
  postponed int not null default 0, created_at timestamptz default now());
create table completions(
  order_id uuid primary key references orders(id), work_done text, extra_charges numeric default 0,
  final_amount numeric, remarks text, technician text, files text[] default '{}',
  payment_amount numeric, payment_method text, completed_at timestamptz default now());
create table order_events(id bigserial primary key, order_id uuid references orders(id), actor text, action text, created_at timestamptz default now());
-- Demo policies (mock roles, no real auth). Tighten per role before production.
alter table technicians enable row level security; alter table orders enable row level security;
alter table completions enable row level security; alter table order_events enable row level security;
create policy demo_all on technicians for all using (true) with check (true);
create policy demo_all on orders for all using (true) with check (true);
create policy demo_all on completions for all using (true) with check (true);
create policy demo_all on order_events for all using (true) with check (true);
insert into storage.buckets(id,name,public) values('job-files','job-files',true);
create policy demo_files on storage.objects for all using (bucket_id='job-files') with check (bucket_id='job-files');



--I run this later to improve the login page which include id and password and roles selector.
create extension if not exists pgcrypto;

create table app_users(
  id serial primary key,
  username text unique not null,
  password_hash text not null,
  role text not null check (role in ('Admin','Technician','Manager')),
  name text not null);
create table app_sessions(
  token uuid primary key default gen_random_uuid(),
  user_id int references app_users(id) on delete cascade,
  created_at timestamptz default now());
-- No policies = the browser can never read these tables directly, only call the functions below.
alter table app_users enable row level security;
alter table app_sessions enable row level security;

create function app_login(p_user text, p_pass text) returns json
language plpgsql security definer set search_path = public, extensions as $$
declare u app_users; t uuid;
begin
  select * into u from app_users where lower(username) = lower(trim(p_user));
  if not found then return null; end if;
  if u.password_hash <> crypt(p_pass, u.password_hash) then return null; end if;
  insert into app_sessions(user_id) values (u.id) returning token into t;
  return json_build_object('token', t, 'username', u.username, 'role', u.role, 'name', u.name);
end $$;

create function app_actor(p_token uuid) returns app_users
language sql security definer set search_path = public as $$
  select u.* from app_sessions s join app_users u on u.id = s.user_id where s.token = p_token $$;

create function app_list_users(p_token uuid) returns json
language plpgsql security definer set search_path = public as $$
declare a app_users;
begin
  a := app_actor(p_token);
  if a.role is distinct from 'Manager' then raise exception 'Not allowed'; end if;
  return (select coalesce(json_agg(json_build_object('id', id, 'username', username, 'role', role, 'name', name) order by id), '[]'::json) from app_users);
end $$;

create function app_add_user(p_token uuid, p_user text, p_pass text, p_role text, p_name text, p_phone text default null) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare a app_users;
begin
  a := app_actor(p_token);
  if a.role is distinct from 'Manager' then raise exception 'Not allowed'; end if;
  if p_role not in ('Admin','Technician') then raise exception 'Role must be Admin or Technician'; end if;
  if length(coalesce(p_pass,'')) < 6 then raise exception 'Password must be at least 6 characters'; end if;
  insert into app_users(username, password_hash, role, name)
    values (lower(trim(p_user)), crypt(p_pass, gen_salt('bf')), p_role, trim(p_name));
  if p_role = 'Technician' then
    insert into technicians(name, phone) values (trim(p_name), p_phone) on conflict (name) do nothing;
  end if;
end $$;

create function app_delete_user(p_token uuid, p_id int) returns void
language plpgsql security definer set search_path = public as $$
declare a app_users; t app_users;
begin
  a := app_actor(p_token);
  if a.role is distinct from 'Manager' then raise exception 'Not allowed'; end if;
  select * into t from app_users where id = p_id;
  if t.role = 'Manager' then raise exception 'Managers cannot be deleted'; end if;
  delete from app_users where id = p_id;
end $$;

grant execute on function app_login(text,text), app_list_users(uuid), app_add_user(uuid,text,text,text,text,text), app_delete_user(uuid,int) to anon;

-- Seed accounts (passwords are stored as bcrypt hashes)
insert into app_users(username, password_hash, role, name) values
 ('manager', extensions.crypt('manager123', extensions.gen_salt('bf')), 'Manager',    'Manager'),
 ('admin',   extensions.crypt('admin123',   extensions.gen_salt('bf')), 'Admin',      'Admin'),
 ('ali',     extensions.crypt('ali123',     extensions.gen_salt('bf')), 'Technician', 'Ali'),
 ('john',    extensions.crypt('john123',    extensions.gen_salt('bf')), 'Technician', 'John'),
 ('bala',    extensions.crypt('bala123',    extensions.gen_salt('bf')), 'Technician', 'Bala');
