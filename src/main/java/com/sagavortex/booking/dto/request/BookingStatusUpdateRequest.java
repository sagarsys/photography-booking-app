package com.sagavortex.booking.dto.request;

import com.sagavortex.booking.domain.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record BookingStatusUpdateRequest(
        @NotNull(message = "Booking status is required")
        BookingStatus status
) {}
