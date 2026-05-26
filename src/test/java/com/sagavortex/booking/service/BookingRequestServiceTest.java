package com.sagavortex.booking.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.sagavortex.booking.domain.BookingRequest;
import com.sagavortex.booking.domain.BookingStatus;
import com.sagavortex.booking.domain.Customer;
import com.sagavortex.booking.domain.PhotographyPackage;
import com.sagavortex.booking.dto.request.BookingRequestCreateRequest;
import com.sagavortex.booking.dto.request.BookingStatusUpdateRequest;
import com.sagavortex.booking.dto.request.CustomerRequest;
import com.sagavortex.booking.dto.response.BookingRequestResponse;
import com.sagavortex.booking.exception.InvalidBookingStatusTransitionException;
import com.sagavortex.booking.repository.BookingRequestRepository;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BookingRequestServiceTest {

    @Mock
    private BookingRequestRepository bookingRequestRepository;

    @Mock
    private CustomerService customerService;

    @Mock
    private PhotographyPackageService photographyPackageService;

    @InjectMocks
    private BookingRequestService bookingRequestService;

    @Test
    void create_shouldPersistPendingBookingRequest() {
        CustomerRequest customerRequest = new CustomerRequest(
                "Ava Lens",
                "ava@example.com",
                "+2301234567"
        );
        BookingRequestCreateRequest request = new BookingRequestCreateRequest(
                customerRequest,
                2L,
                OffsetDateTime.parse("2030-06-01T10:00:00Z"),
                "Sunset beach session"
        );

        Customer customer = Customer.builder()
                .id(5L)
                .fullName("Ava Lens")
                .email("ava@example.com")
                .phone("+2301234567")
                .createdAt(Instant.parse("2026-05-26T14:04:15Z"))
                .updatedAt(Instant.parse("2026-05-26T14:04:15Z"))
                .build();

        PhotographyPackage photographyPackage = PhotographyPackage.builder()
                .id(2L)
                .name("Portrait Session")
                .description("1-hour studio portrait")
                .priceInCents(15000)
                .durationMinutes(60)
                .active(true)
                .createdAt(Instant.parse("2026-05-26T14:03:59Z"))
                .updatedAt(Instant.parse("2026-05-26T14:03:59Z"))
                .build();

        when(customerService.findOrCreate(customerRequest)).thenReturn(customer);
        when(photographyPackageService.findActiveEntityById(2L)).thenReturn(photographyPackage);
        when(bookingRequestRepository.save(any(BookingRequest.class))).thenAnswer(invocation -> {
            BookingRequest bookingRequest = invocation.getArgument(0);
            bookingRequest.setId(1L);
            bookingRequest.setCreatedAt(Instant.parse("2026-05-26T14:04:15Z"));
            bookingRequest.setUpdatedAt(Instant.parse("2026-05-26T14:04:15Z"));
            return bookingRequest;
        });

        BookingRequestResponse response = bookingRequestService.create(request);
        ArgumentCaptor<BookingRequest> bookingRequestCaptor = ArgumentCaptor.forClass(BookingRequest.class);

        verify(bookingRequestRepository).save(bookingRequestCaptor.capture());
        BookingRequest savedBookingRequest = bookingRequestCaptor.getValue();

        assertThat(savedBookingRequest.getStatus()).isEqualTo(BookingStatus.PENDING);
        assertThat(savedBookingRequest.getCustomer()).isEqualTo(customer);
        assertThat(savedBookingRequest.getPhotographyPackage()).isEqualTo(photographyPackage);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.status()).isEqualTo(BookingStatus.PENDING);
        assertThat(response.customer().email()).isEqualTo("ava@example.com");
        assertThat(response.photographyPackage().id()).isEqualTo(2L);
    }

    @Test
    void updateStatus_shouldAllowValidTransition() {
        BookingRequest bookingRequest = buildBookingRequest(1L, BookingStatus.PENDING);

        when(bookingRequestRepository.findById(1L)).thenReturn(Optional.of(bookingRequest));
        when(bookingRequestRepository.save(any(BookingRequest.class))).thenAnswer(invocation -> invocation.getArgument(0));

        BookingRequestResponse response =
                bookingRequestService.updateStatus(1L, new BookingStatusUpdateRequest(BookingStatus.CONFIRMED));

        assertThat(response.status()).isEqualTo(BookingStatus.CONFIRMED);
        assertThat(bookingRequest.getStatus()).isEqualTo(BookingStatus.CONFIRMED);
    }

    @Test
    void updateStatus_shouldRejectInvalidTransition() {
        BookingRequest bookingRequest = buildBookingRequest(1L, BookingStatus.COMPLETED);

        when(bookingRequestRepository.findById(1L)).thenReturn(Optional.of(bookingRequest));

        assertThatThrownBy(() ->
                bookingRequestService.updateStatus(1L, new BookingStatusUpdateRequest(BookingStatus.PENDING)))
                .isInstanceOf(InvalidBookingStatusTransitionException.class)
                .hasMessageContaining("Invalid status transition");

        verify(bookingRequestRepository, never()).save(any(BookingRequest.class));
    }

    private BookingRequest buildBookingRequest(Long id, BookingStatus status) {
        Customer customer = Customer.builder()
                .id(5L)
                .fullName("Ava Lens")
                .email("ava@example.com")
                .phone("+2301234567")
                .createdAt(Instant.parse("2026-05-26T14:04:15Z"))
                .updatedAt(Instant.parse("2026-05-26T14:04:15Z"))
                .build();

        PhotographyPackage photographyPackage = PhotographyPackage.builder()
                .id(2L)
                .name("Portrait Session")
                .description("1-hour studio portrait")
                .priceInCents(15000)
                .durationMinutes(60)
                .active(true)
                .createdAt(Instant.parse("2026-05-26T14:03:59Z"))
                .updatedAt(Instant.parse("2026-05-26T14:03:59Z"))
                .build();

        return BookingRequest.builder()
                .id(id)
                .customer(customer)
                .photographyPackage(photographyPackage)
                .requestedDate(OffsetDateTime.parse("2030-06-01T10:00:00Z"))
                .message("Sunset beach session")
                .status(status)
                .createdAt(Instant.parse("2026-05-26T14:04:15Z"))
                .updatedAt(Instant.parse("2026-05-26T14:04:15Z"))
                .build();
    }
}
