package com.sagavortex.booking.exception;

public class InvalidBookingStatusTransitionException extends RuntimeException {

    public InvalidBookingStatusTransitionException(String message) {
        super(message);
    }
}
