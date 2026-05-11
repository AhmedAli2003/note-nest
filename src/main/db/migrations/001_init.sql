create table if not exists notes (
  id          text primary key,
  text        text not null default '',
  created_at  integer not null,
  updated_at  integer not null
);

create table if not exists tasks (
  id          text primary key,
  title       text not null,
  due_at      integer,
  priority    text not null default 'medium' check (priority in ('high','medium','low')),
  is_done     integer not null default 0 check (is_done in (0,1)),
  created_at  integer not null,
  updated_at  integer not null
);

create index if not exists idx_tasks_due_at   on tasks(due_at);
create index if not exists idx_tasks_is_done  on tasks(is_done);

create table if not exists articles (
  id          text primary key,
  title       text not null default '',
  body_json   text not null default '',
  body_html   text not null default '',
  created_at  integer not null,
  updated_at  integer not null
);

create index if not exists idx_notes_updated_at    on notes(updated_at desc);
create index if not exists idx_articles_updated_at on articles(updated_at desc);
