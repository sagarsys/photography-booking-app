package com.sagavortex.booking.dto.response;

import java.time.Instant;

public record CustomerResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        Instant createdAt,
        Instant updatedAt
) {}
