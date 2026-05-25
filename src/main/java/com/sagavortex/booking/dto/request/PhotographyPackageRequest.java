package com.sagavortex.booking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PhotographyPackageRequest(
        @NotBlank(message = "Package name is required")
        @Size(max = 255, message = "Package name must be at most 255 characters")
        String name,

        @Size(max = 5000, message = "Description must be at most 5000 characters")
        String description,

        @Positive(message = "Package price must be positive")
        Integer priceInCents,

        @Positive(message = "Package duration must be positive")
        Integer durationMinutes
) {}
