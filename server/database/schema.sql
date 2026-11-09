create table if not exists boards (
  id          text primary key,
  name        text not null,
  created_at  timestamptz not null default now()
);

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

create index if not exists columns_board_id_idx on columns (board_id);
create index if not exists cards_column_id_idx on cards (column_id);
