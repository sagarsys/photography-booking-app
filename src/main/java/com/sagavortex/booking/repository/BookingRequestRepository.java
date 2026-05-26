package com.sagavortex.booking.repository;

import com.sagavortex.booking.domain.BookingRequest;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRequestRepository extends JpaRepository<BookingRequest, Long> {

    List<BookingRequest> findAllByOrderByCreatedAtDesc();
}
