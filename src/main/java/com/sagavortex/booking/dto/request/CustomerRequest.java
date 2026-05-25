package com.sagavortex.booking.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CustomerRequest(
        @NotBlank(message = "Customer full name is required")
        @Size(max = 255, message = "Customer full name must be at most 255 characters")
        String fullName,

        @NotBlank(message = "Customer email is required")
        @Email(message = "Customer email must be valid")
        @Size(max = 255, message = "Customer email must be at most 255 characters")
        String email,

        @Size(max = 50, message = "Customer phone must be at most 50 characters")
        String phone
) {}
