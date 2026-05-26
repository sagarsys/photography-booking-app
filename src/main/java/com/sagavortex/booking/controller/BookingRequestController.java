package com.sagavortex.booking.controller;

import com.sagavortex.booking.dto.request.BookingRequestCreateRequest;
import com.sagavortex.booking.dto.request.BookingStatusUpdateRequest;
import com.sagavortex.booking.dto.response.BookingRequestResponse;
import com.sagavortex.booking.service.BookingRequestService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/booking-requests")
public class BookingRequestController {

    private final BookingRequestService bookingRequestService;

    public BookingRequestController(BookingRequestService bookingRequestService) {
        this.bookingRequestService = bookingRequestService;
    }

    @PostMapping
    public ResponseEntity<BookingRequestResponse> createBookingRequest(
            @Valid @RequestBody BookingRequestCreateRequest request) {
        BookingRequestResponse created = bookingRequestService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @GetMapping
    public List<BookingRequestResponse> listBookingRequests() {
        return bookingRequestService.findAll();
    }

    @GetMapping("/{id}")
    public BookingRequestResponse getBookingRequest(@PathVariable Long id) {
        return bookingRequestService.findById(id);
    }

    @PatchMapping("/{id}/status")
    public BookingRequestResponse updateBookingStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request) {
        return bookingRequestService.updateStatus(id, request);
    }
}
