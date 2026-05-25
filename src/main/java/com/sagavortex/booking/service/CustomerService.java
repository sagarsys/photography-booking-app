package com.sagavortex.booking.service;

import com.sagavortex.booking.domain.Customer;
import com.sagavortex.booking.dto.request.CustomerRequest;
import com.sagavortex.booking.dto.response.CustomerResponse;
import com.sagavortex.booking.exception.ResourceNotFoundException;
import com.sagavortex.booking.repository.CustomerRepository;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public CustomerResponse findById(Long id) {
        return toResponse(getCustomerOrThrow(id));
    }

    @Transactional
    public Customer findOrCreate(CustomerRequest request) {
        String normalizedEmail = normalizeEmail(request.email());

        return customerRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> customerRepository.save(Customer.builder()
                        .fullName(request.fullName())
                        .email(normalizedEmail)
                        .phone(request.phone())
                        .build()));
    }

    public CustomerResponse toResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getCreatedAt(),
                customer.getUpdatedAt()
        );
    }

    private Customer getCustomerOrThrow(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
