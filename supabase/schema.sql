create extension if not exists "pgcrypto";

create table if not exists strategies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  name text not null,
  description text,
  rules text,
  created_at timestamptz default now()
);

create table if not exists mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table if not exists trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  trade_code text,
  date date not null,
  asset text not null,
  direction text not null,
  strategy_id uuid references strategies(id) on delete set null,
  setup_type text,
  timeframe text,
  entry_price numeric,
  exit_price numeric,
  stop_loss numeric,
  position_size numeric,
  risk_per_trade numeric,
  rr_ratio numeric,
  profit_loss numeric,
  result text,
  pre_trade_reasoning text,
  post_trade_reflection text,
  what_went_right text,
  what_went_wrong text,
  lessons_learned text,
  emotional_state text,
  rule_followed boolean,
  mistake_id uuid references mistakes(id) on delete set null,
  mistake_category text,
  created_at timestamptz default now()
);

create table if not exists tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  name text not null,
  created_at timestamptz default now(),
  unique (user_id, name)
);

create table if not exists trade_tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  trade_id uuid not null references trades(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  created_at timestamptz default now(),
  unique (trade_id, tag_id)
);

create table if not exists trade_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  trade_id uuid not null references trades(id) on delete cascade,
  url text not null,
  label text,
  link_type text,
  created_at timestamptz default now()
);

create table if not exists trade_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  trade_id uuid not null references trades(id) on delete cascade,
  storage_path text not null,
  caption text,
  created_at timestamptz default now()
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  title text not null,
  tags text[],
  content text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists watchlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  asset_name text not null,
  notes text,
  reason text,
  created_at timestamptz default now()
);

create table if not exists playbook_setups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  name text not null,
  rules text,
  checklist jsonb,
  created_at timestamptz default now()
);

create table if not exists daily_checklist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  date date not null,
  section text not null,
  text text not null,
  completed boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists trades_user_date_idx on trades(user_id, date);
create index if not exists trades_user_strategy_idx on trades(user_id, strategy_id);
create index if not exists trades_user_result_idx on trades(user_id, result);
create index if not exists trades_user_asset_idx on trades(user_id, asset);
create index if not exists trades_user_timeframe_idx on trades(user_id, timeframe);
create index if not exists trade_tags_trade_idx on trade_tags(trade_id);
create index if not exists trade_tags_tag_idx on trade_tags(tag_id);
create index if not exists trade_links_trade_idx on trade_links(trade_id);
create index if not exists trade_images_trade_idx on trade_images(trade_id);
create index if not exists notes_user_idx on notes(user_id);
create index if not exists notes_user_created_idx on notes(user_id, created_at);
create index if not exists watchlist_user_created_idx on watchlist(user_id, created_at);
create index if not exists daily_checklist_user_date_idx on daily_checklist(user_id, date);
create index if not exists strategies_user_idx on strategies(user_id);
create index if not exists mistakes_user_idx on mistakes(user_id);
create index if not exists playbook_user_idx on playbook_setups(user_id);

alter table strategies enable row level security;
alter table mistakes enable row level security;
alter table trades enable row level security;
alter table tags enable row level security;
alter table trade_tags enable row level security;
alter table trade_links enable row level security;
alter table trade_images enable row level security;
alter table notes enable row level security;
alter table watchlist enable row level security;
alter table playbook_setups enable row level security;
alter table daily_checklist enable row level security;

create policy "Users can manage own strategies" on strategies
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own mistakes" on mistakes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own trades" on trades
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own tags" on tags
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own trade tags" on trade_tags
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own trade links" on trade_links
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own trade images" on trade_images
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own notes" on notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own watchlist" on watchlist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own playbook" on playbook_setups
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can manage own checklist" on daily_checklist
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
