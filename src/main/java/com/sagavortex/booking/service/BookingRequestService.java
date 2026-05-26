package com.sagavortex.booking.service;

import com.sagavortex.booking.domain.BookingRequest;
import com.sagavortex.booking.domain.BookingStatus;
import com.sagavortex.booking.domain.Customer;
import com.sagavortex.booking.domain.PhotographyPackage;
import com.sagavortex.booking.dto.request.BookingRequestCreateRequest;
import com.sagavortex.booking.dto.request.BookingStatusUpdateRequest;
import com.sagavortex.booking.dto.response.BookingRequestResponse;
import com.sagavortex.booking.dto.response.CustomerResponse;
import com.sagavortex.booking.dto.response.PhotographyPackageResponse;
import com.sagavortex.booking.exception.InvalidBookingStatusTransitionException;
import com.sagavortex.booking.exception.ResourceNotFoundException;
import com.sagavortex.booking.repository.BookingRequestRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BookingRequestService {

    private final BookingRequestRepository bookingRequestRepository;
    private final CustomerService customerService;
    private final PhotographyPackageService photographyPackageService;

    public BookingRequestService(
            BookingRequestRepository bookingRequestRepository,
            CustomerService customerService,
            PhotographyPackageService photographyPackageService) {
        this.bookingRequestRepository = bookingRequestRepository;
        this.customerService = customerService;
        this.photographyPackageService = photographyPackageService;
    }

    public List<BookingRequestResponse> findAll() {
        return bookingRequestRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public BookingRequestResponse findById(Long id) {
        return toResponse(getBookingRequestOrThrow(id));
    }

    @Transactional
    public BookingRequestResponse create(BookingRequestCreateRequest request) {
        Customer customer = customerService.findOrCreate(request.customer());
        PhotographyPackage photographyPackage =
                photographyPackageService.findActiveEntityById(request.photographyPackageId());

        BookingRequest bookingRequest = BookingRequest.builder()
                .customer(customer)
                .photographyPackage(photographyPackage)
                .requestedDate(request.requestedDate())
                .message(request.message())
                .status(BookingStatus.PENDING)
                .build();

        return toResponse(bookingRequestRepository.save(bookingRequest));
    }

    @Transactional
    public BookingRequestResponse updateStatus(Long id, BookingStatusUpdateRequest request) {
        BookingRequest bookingRequest = getBookingRequestOrThrow(id);
        BookingStatus newStatus = request.status();

        if (!isValidTransition(bookingRequest.getStatus(), newStatus)) {
            throw new InvalidBookingStatusTransitionException(
                    "Invalid status transition from "
                            + bookingRequest.getStatus()
                            + " to "
                            + newStatus);
        }

        bookingRequest.setStatus(newStatus);
        return toResponse(bookingRequestRepository.save(bookingRequest));
    }

    private BookingRequest getBookingRequestOrThrow(Long id) {
        return bookingRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking request not found: " + id));
    }

    private boolean isValidTransition(BookingStatus currentStatus, BookingStatus newStatus) {
        if (currentStatus == newStatus) {
            return true;
        }

        return switch (currentStatus) {
            case PENDING -> newStatus == BookingStatus.CONFIRMED || newStatus == BookingStatus.CANCELLED;
            case CONFIRMED -> newStatus == BookingStatus.COMPLETED || newStatus == BookingStatus.CANCELLED;
            case CANCELLED, COMPLETED -> false;
        };
    }

    private BookingRequestResponse toResponse(BookingRequest bookingRequest) {
        Customer customer = bookingRequest.getCustomer();
        PhotographyPackage photographyPackage = bookingRequest.getPhotographyPackage();

        return new BookingRequestResponse(
                bookingRequest.getId(),
                new CustomerResponse(
                        customer.getId(),
                        customer.getFullName(),
                        customer.getEmail(),
                        customer.getPhone(),
                        customer.getCreatedAt(),
                        customer.getUpdatedAt()
                ),
                new PhotographyPackageResponse(
                        photographyPackage.getId(),
                        photographyPackage.getName(),
                        photographyPackage.getDescription(),
                        photographyPackage.getPriceInCents(),
                        photographyPackage.getDurationMinutes(),
                        photographyPackage.isActive(),
                        photographyPackage.getCreatedAt(),
                        photographyPackage.getUpdatedAt()
                ),
                bookingRequest.getRequestedDate(),
                bookingRequest.getMessage(),
                bookingRequest.getStatus(),
                bookingRequest.getCreatedAt(),
                bookingRequest.getUpdatedAt()
        );
    }
}
