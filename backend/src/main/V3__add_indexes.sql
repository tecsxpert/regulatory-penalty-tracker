-- Index for soft delete filter (used in every findByIsDeletedFalse query)
CREATE INDEX IF NOT EXISTS idx_penalty_is_deleted
    ON penalties(is_deleted);

-- Composite index for status + is_deleted (used in stats queries)
CREATE INDEX IF NOT EXISTS idx_penalty_status_deleted
    ON penalties(status, is_deleted);

-- Index for due_date range filters
CREATE INDEX IF NOT EXISTS idx_penalty_due_date
    ON penalties(due_date);

-- Index for title search (case-insensitive LIKE queries)
CREATE INDEX IF NOT EXISTS idx_penalty_title
    ON penalties(title);

-- Index for regulation_body grouping (analytics charts)
CREATE INDEX IF NOT EXISTS idx_penalty_regulation_body
    ON penalties(regulation_body);

-- Composite index for audit_log queries
CREATE INDEX IF NOT EXISTS idx_audit_entity
    ON audit_log(entity_type, action);