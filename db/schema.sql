-- db/schema.sql  (apply once via the Neon SQL console)
CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS bookings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_type_id  text NOT NULL,
  start_utc        timestamptz NOT NULL,
  end_utc          timestamptz NOT NULL,
  invitee_name     text NOT NULL,
  invitee_email    text NOT NULL,
  invitee_timezone text NOT NULL,
  notes            text,
  google_event_id  text,
  video_url        text,
  video_meeting_id text,
  status           text NOT NULL DEFAULT 'confirmed',
  cancel_token     text NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT no_overlap EXCLUDE USING gist (
    tstzrange(start_utc, end_utc) WITH &&
  ) WHERE (status = 'confirmed')
);

-- Migration for databases created before video links were added:
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS video_meeting_id text;
