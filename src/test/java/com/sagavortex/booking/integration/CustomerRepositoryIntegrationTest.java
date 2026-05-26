package com.sagavortex.booking.integration;

import static org.assertj.core.api.Assertions.assertThat;

import com.sagavortex.booking.domain.Customer;
import com.sagavortex.booking.repository.CustomerRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@Testcontainers
class CustomerRepositoryIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    private CustomerRepository customerRepository;

    @BeforeEach
    void setUp() {
        customerRepository.deleteAll();
    }

    @Test
    void findByEmailIgnoreCase_shouldFindPersistedCustomer() {
        Customer savedCustomer = customerRepository.saveAndFlush(Customer.builder()
                .fullName("Ava Lens")
                .email("ava@example.com")
                .phone("+2301234567")
                .build());

        Optional<Customer> result = customerRepository.findByEmailIgnoreCase("AVA@EXAMPLE.COM");

        assertThat(result).isPresent();
        assertThat(result.get().getId()).isEqualTo(savedCustomer.getId());
        assertThat(result.get().getEmail()).isEqualTo("ava@example.com");
    }
}
