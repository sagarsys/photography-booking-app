package com.sagavortex.booking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidBookingStatusTransitionException extends RuntimeException {

    public InvalidBookingStatusTransitionException(String message) {
        super(message);
    }
}
