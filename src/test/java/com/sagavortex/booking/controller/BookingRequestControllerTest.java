package com.sagavortex.booking.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.sagavortex.booking.controller.advice.GlobalExceptionHandler;
import com.sagavortex.booking.domain.BookingStatus;
import com.sagavortex.booking.dto.response.BookingRequestResponse;
import com.sagavortex.booking.dto.response.CustomerResponse;
import com.sagavortex.booking.dto.response.PhotographyPackageResponse;
import com.sagavortex.booking.service.BookingRequestService;
import java.time.Instant;
import java.time.OffsetDateTime;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(BookingRequestController.class)
@Import(GlobalExceptionHandler.class)
class BookingRequestControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BookingRequestService bookingRequestService;

    @Test
    void createBookingRequest_shouldReturnCreatedBooking() throws Exception {
        BookingRequestResponse response = new BookingRequestResponse(
                1L,
                new CustomerResponse(
                        5L,
                        "Ava Lens",
                        "ava@example.com",
                        "+2301234567",
                        Instant.parse("2026-05-26T14:04:15Z"),
                        Instant.parse("2026-05-26T14:04:15Z")
                ),
                new PhotographyPackageResponse(
                        2L,
                        "Portrait Session",
                        "1-hour studio portrait",
                        15000,
                        60,
                        true,
                        Instant.parse("2026-05-26T14:03:59Z"),
                        Instant.parse("2026-05-26T14:03:59Z")
                ),
                OffsetDateTime.parse("2030-06-01T10:00:00Z"),
                "Sunset beach session",
                BookingStatus.PENDING,
                Instant.parse("2026-05-26T14:04:15Z"),
                Instant.parse("2026-05-26T14:04:15Z")
        );

        when(bookingRequestService.create(any())).thenReturn(response);

        mockMvc.perform(post("/api/booking-requests")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "customer": {
                                    "fullName": "Ava Lens",
                                    "email": "ava@example.com",
                                    "phone": "+2301234567"
                                  },
                                  "photographyPackageId": 2,
                                  "requestedDate": "2030-06-01T10:00:00Z",
                                  "message": "Sunset beach session"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/booking-requests/1"))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.customer.email").value("ava@example.com"))
                .andExpect(jsonPath("$.photographyPackage.id").value(2));
    }

    @Test
    void createBookingRequest_shouldReturnValidationErrorsForInvalidBody() throws Exception {
        mockMvc.perform(post("/api/booking-requests")
                        .contentType(APPLICATION_JSON)
                        .content("""
                                {
                                  "customer": null,
                                  "photographyPackageId": null,
                                  "requestedDate": null,
                                  "message": "Sunset beach session"
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.customer").value("Customer is required"))
                .andExpect(jsonPath("$.fieldErrors.photographyPackageId")
                        .value("Photography package id is required"))
                .andExpect(jsonPath("$.fieldErrors.requestedDate")
                        .value("Booking requested date is required"));
    }
}
