CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS user_settings (
  user_id text PRIMARY KEY,
  time_zone text NOT NULL DEFAULT 'America/Sao_Paulo',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  default_start_time time NOT NULL,
  default_duration_minutes integer NOT NULL CHECK (default_duration_minutes > 0),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS task_template_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES task_templates(id) ON DELETE CASCADE,
  weekday integer NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  CONSTRAINT task_template_days_template_weekday_unique UNIQUE (template_id, weekday)
);

CREATE TABLE IF NOT EXISTS daily_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  template_id uuid REFERENCES task_templates(id) ON DELETE SET NULL,
  date date NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  planned_start time NOT NULL,
  planned_duration_minutes integer NOT NULL CHECK (planned_duration_minutes > 0),
  status text NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'running', 'paused', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT daily_tasks_template_date_unique UNIQUE (user_id, template_id, date)
);

CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_task_id uuid NOT NULL REFERENCES daily_tasks(id) ON DELETE CASCADE,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS daily_tasks_one_running_per_user ON daily_tasks (user_id) WHERE status = 'running';
CREATE INDEX IF NOT EXISTS task_templates_user_idx ON task_templates (user_id);
CREATE INDEX IF NOT EXISTS daily_tasks_user_date_idx ON daily_tasks (user_id, date);
CREATE INDEX IF NOT EXISTS focus_sessions_task_idx ON focus_sessions (daily_task_id);
