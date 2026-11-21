create table if not exists users (
  id             text primary key,
  username       text not null unique,
  password_hash  text not null,
  created_at     timestamptz not null default now()
);

create table if not exists boards (
  id          text primary key,
  owner_id    text references users (id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

alter table boards add column if not exists owner_id text references users (id) on delete cascade;

create table if not exists columns (
  id            text primary key,
  board_id      text not null references boards (id) on delete cascade,
  title         text not null,
  position      integer not null,
  is_done       boolean not null default false,
  is_collapsed  boolean not null default false
);

create table if not exists cards (
  id           text primary key,
  column_id    text not null references columns (id) on delete cascade,
  title        text not null,
  description  text not null default '',
  position     integer not null,
  created_at   timestamptz not null default now()
);

alter table columns add column if not exists is_in_progress boolean not null default false;

alter table cards add column if not exists priority text check (priority in ('low', 'medium', 'high', 'urgent'));
alter table cards add column if not exists due_date date;

create index if not exists boards_owner_id_idx on boards (owner_id);
create index if not exists columns_board_id_idx on columns (board_id);
create index if not exists cards_column_id_idx on cards (column_id);

create table if not exists subtasks (
  id        text primary key,
  card_id   text not null references cards (id) on delete cascade,
  title     text not null,
  is_done   boolean not null default false,
  position  integer not null
);

create index if not exists subtasks_card_id_idx on subtasks (card_id);
