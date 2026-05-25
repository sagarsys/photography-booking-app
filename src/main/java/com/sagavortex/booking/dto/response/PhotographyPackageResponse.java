package com.sagavortex.booking.dto.response;

import java.time.Instant;

public record PhotographyPackageResponse(
        Long id,
        String name,
        String description,
        Integer priceInCents,
        Integer durationMinutes,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {}
