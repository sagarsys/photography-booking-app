package com.sagavortex.booking.dto.response;

import com.sagavortex.booking.domain.BookingStatus;
import java.time.Instant;
import java.time.OffsetDateTime;

public record BookingRequestResponse(
        Long id,
        CustomerResponse customer,
        PhotographyPackageResponse photographyPackage,
        OffsetDateTime requestedDate,
        String message,
        BookingStatus status,
        Instant createdAt,
        Instant updatedAt
) {}
