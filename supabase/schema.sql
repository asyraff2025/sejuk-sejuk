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
