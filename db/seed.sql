-- ============================================================================
-- Aroviax — Seed Data for Development
--
-- Populates the database with sample data matching the existing TypeScript
-- sample constants (SAMPLE_HEALTH_NOTES, SAMPLE_MEDICATIONS) so that the
-- server-side backend behaves identically to the client-side demo.
--
-- Usage:  psql -d aroviax -f db/seed.sql
-- ============================================================================

BEGIN;

-- Create a demo user
INSERT INTO users (id, display_name, email, locale) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Demo User', 'demo@example.com', 'en')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Health Notes — mirrors SAMPLE_HEALTH_NOTES from src/lib/healthNotes.ts
-- ---------------------------------------------------------------------------
INSERT INTO health_notes (user_id, title, body, note_date, tags, created_at, updated_at) VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'Blood pressure reading at pharmacy',
    'Reading was 128/82. Pharmacist said to monitor and schedule a check-up if consistently above 130/85. Will track again next week.',
    '2026-10-10',
    ARRAY['blood pressure', 'pharmacy', 'monitoring'],
    '2026-10-10T09:00:00Z',
    '2026-10-10T09:00:00Z'
),
(
    'a0000000-0000-0000-0000-000000000001',
    'Post-appointment notes — Dr. Hossain',
    'Doctor reviewed symptoms. Recommended increasing water intake, reducing screen time. Follow-up in 4 weeks. Lab results expected in 3 days.',
    '2026-10-14',
    ARRAY['appointment', 'doctor', 'follow-up'],
    '2026-10-14T14:30:00Z',
    '2026-10-14T14:30:00Z'
);

-- ---------------------------------------------------------------------------
-- Medications — mirrors SAMPLE_MEDICATIONS from src/lib/medicationOrganizer.ts
-- ---------------------------------------------------------------------------
INSERT INTO medications (user_id, name, instructions, purpose, start_date, reminders, pharmacist_questions, is_active) VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'Metformin 500 mg',
    'Take one tablet twice daily with meals (morning and evening) as directed by doctor.',
    'Blood sugar management — as told by my doctor',
    '2026-09-15',
    'Store away from heat and moisture. Take with food to reduce stomach upset.',
    ARRAY['What should I do if I miss a dose?', 'Are there any foods I should avoid while taking this?'],
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000001',
    'Folic Acid 5 mg',
    'One tablet daily in the morning before breakfast.',
    'As prescribed alongside primary medication',
    '2026-09-15',
    NULL,
    ARRAY['Is this dose appropriate with my other medications?'],
    TRUE
);

COMMIT;
