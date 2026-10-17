-- ============================================================================
-- Aroviax — AI Health Companion
-- Database Schema (PostgreSQL)
--
-- This schema supports persistent storage for the Aroviax health companion
-- application. It mirrors the data models currently defined in TypeScript
-- (healthNotes.ts, medicationOrganizer.ts, symptomOrganizer.ts, chat.ts)
-- and provides the relational foundation for a future server-side backend.
--
-- CLINICAL GOVERNANCE NOTICE:
-- This database stores USER-ENTERED health information only.
-- No column, constraint, or default value should imply clinical diagnosis.
-- All medical data is self-reported and explicitly labeled as unverified.
-- ============================================================================

BEGIN;

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    display_name    VARCHAR(120) NOT NULL,
    email           VARCHAR(254) UNIQUE,
    locale          VARCHAR(5)  NOT NULL DEFAULT 'en'
        CHECK (locale IN ('en', 'bn')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);

-- ---------------------------------------------------------------------------
-- Health Notes
-- Mirrors: src/lib/healthNotes.ts → HealthNote interface
-- ---------------------------------------------------------------------------
CREATE TABLE health_notes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(300) NOT NULL,
    body            TEXT NOT NULL DEFAULT '',
    note_date       DATE NOT NULL DEFAULT CURRENT_DATE,
    tags            TEXT[] NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_health_notes_user   ON health_notes (user_id);
CREATE INDEX idx_health_notes_date   ON health_notes (note_date DESC);
CREATE INDEX idx_health_notes_tags   ON health_notes USING GIN (tags);

COMMENT ON TABLE health_notes IS
    'Personal health notes entered by the user. All content is self-reported.';

-- ---------------------------------------------------------------------------
-- Medications
-- Mirrors: src/lib/medicationOrganizer.ts → MedicationEntry interface
-- ---------------------------------------------------------------------------
CREATE TABLE medications (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name                VARCHAR(200) NOT NULL,
    instructions        TEXT NOT NULL DEFAULT '',
    purpose             TEXT NOT NULL DEFAULT '',
    start_date          DATE,
    end_date            DATE,
    reminders           TEXT,
    pharmacist_questions TEXT[] NOT NULL DEFAULT '{}',
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    added_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_medications_user    ON medications (user_id);
CREATE INDEX idx_medications_active  ON medications (user_id, is_active)
    WHERE is_active = TRUE;

COMMENT ON TABLE medications IS
    'User-entered medication records. Names and dosages stored exactly as typed. '
    'NOT verified by any clinical system — labeled "user-entered, not verified."';

-- ---------------------------------------------------------------------------
-- Symptom Reports
-- Mirrors: src/lib/symptomOrganizer.ts → SymptomOrganizerData interface
-- ---------------------------------------------------------------------------
CREATE TABLE symptom_reports (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    main_concern            TEXT NOT NULL,
    onset_date              DATE,
    duration_description    VARCHAR(300),
    severity_rating         SMALLINT CHECK (severity_rating BETWEEN 1 AND 10),
    body_location           VARCHAR(200),
    qualities               TEXT[] NOT NULL DEFAULT '{}',
    associated_symptoms     TEXT,
    triggers                TEXT,
    relieving_factors       TEXT,
    relevant_context        TEXT,
    questions_for_doctor    TEXT[] NOT NULL DEFAULT '{}',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_symptom_reports_user ON symptom_reports (user_id);
CREATE INDEX idx_symptom_reports_date ON symptom_reports (created_at DESC);

COMMENT ON TABLE symptom_reports IS
    'Structured symptom data collected through the guided organizer. '
    'Purely organizational — no diagnosis or clinical scoring is applied.';

-- ---------------------------------------------------------------------------
-- Chat Conversations
-- Mirrors: src/types/chat.ts → ChatMessage interface
-- ---------------------------------------------------------------------------
CREATE TABLE conversations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mode            VARCHAR(20) NOT NULL DEFAULT 'chat'
        CHECK (mode IN ('chat', 'translate', 'afterVisit')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversations_user ON conversations (user_id);

CREATE TABLE chat_messages (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id     UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role                VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
    content             TEXT NOT NULL,
    is_emergency_alert  BOOLEAN NOT NULL DEFAULT FALSE,
    safety_notice       TEXT,
    confidence_note     TEXT,
    provider            VARCHAR(30),
    model_used          VARCHAR(100),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_messages_convo ON chat_messages (conversation_id, created_at);

COMMENT ON TABLE chat_messages IS
    'Stores chat message history. Emergency alerts are flagged but never suppressed. '
    'The safety_notice column always contains the standard non-diagnostic disclaimer.';

-- ---------------------------------------------------------------------------
-- Audit Log — privacy-first activity tracking
-- ---------------------------------------------------------------------------
CREATE TABLE audit_log (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action          VARCHAR(80) NOT NULL,
    resource_type   VARCHAR(40),
    resource_id     UUID,
    ip_address      INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_log_user   ON audit_log (user_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON audit_log (action);

COMMENT ON TABLE audit_log IS
    'Privacy-first audit trail. Stores action type and resource reference only — '
    'never logs message content, health data, or personal information.';

-- ---------------------------------------------------------------------------
-- Data Retention Policy View
-- Surfaces records eligible for automated cleanup (90-day default)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW data_retention_candidates AS
SELECT
    'chat_messages' AS resource_type,
    cm.id AS resource_id,
    cm.created_at,
    now() - cm.created_at AS age
FROM chat_messages cm
WHERE cm.created_at < now() - INTERVAL '90 days'
UNION ALL
SELECT
    'audit_log',
    al.id::UUID,
    al.created_at,
    now() - al.created_at
FROM audit_log al
WHERE al.created_at < now() - INTERVAL '180 days';

COMMENT ON VIEW data_retention_candidates IS
    'Lists records older than retention thresholds for scheduled cleanup.';

COMMIT;
