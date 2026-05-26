package com.sagavortex.booking.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;

public record BookingRequestCreateRequest(
        @NotNull(message = "Customer is required")
        @Valid
        CustomerRequest customer,

        @NotNull(message = "Photography package id is required")
        Long photographyPackageId,

        @NotNull(message = "Booking requested date is required")
        @Future(message = "Booking requested date must be in the future")
        OffsetDateTime requestedDate,

        @Size(max = 5000, message = "Message must be at most 5000 characters")
        String message
) {}
