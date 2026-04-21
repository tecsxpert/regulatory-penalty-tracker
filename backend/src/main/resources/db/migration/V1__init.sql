CREATE TABLE penalties (
    id SERIAL PRIMARY KEY,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    regulation_body VARCHAR(100),

    penalty_amount DECIMAL(12,2),

    status VARCHAR(50) DEFAULT 'OPEN',

    due_date DATE,

    ai_description TEXT,
    ai_recommendation TEXT,

    is_deleted BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_penalty_status ON penalties(status);
CREATE INDEX idx_penalty_due_date ON penalties(due_date);