CREATE TABLE booking_requests (
    id                    BIGSERIAL PRIMARY KEY,
    customer_id           BIGINT NOT NULL REFERENCES customers (id),
    photography_package_id BIGINT NOT NULL REFERENCES photography_packages (id),
    requested_date        TIMESTAMPTZ NOT NULL,
    message               TEXT,
    status                VARCHAR(50) NOT NULL,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_booking_requests_customer_id ON booking_requests (customer_id);
CREATE INDEX idx_booking_requests_package_id ON booking_requests (photography_package_id);
CREATE INDEX idx_booking_requests_status ON booking_requests (status);
CREATE INDEX idx_booking_requests_requested_date ON booking_requests (requested_date);
