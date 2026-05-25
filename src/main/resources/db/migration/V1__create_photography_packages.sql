CREATE TABLE photography_packages (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    price_in_cents  INTEGER NOT NULL CHECK (price_in_cents > 0),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photography_packages_active ON photography_packages (active);
