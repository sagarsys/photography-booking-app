package com.sagavortex.booking.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import com.sagavortex.booking.domain.PhotographyPackage;
import com.sagavortex.booking.dto.response.PhotographyPackageResponse;
import com.sagavortex.booking.repository.PhotographyPackageRepository;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PhotographyPackageServiceTest {

    @Mock
    private PhotographyPackageRepository packageRepository;

    @InjectMocks
    private PhotographyPackageService photographyPackageService;

    @Test
    void findAllActive_shouldMapEntitiesToResponseDtos() {
        PhotographyPackage portraitPackage = PhotographyPackage.builder()
                .id(1L)
                .name("Portrait Session")
                .description("Studio portrait session")
                .priceInCents(15000)
                .durationMinutes(60)
                .active(true)
                .createdAt(Instant.parse("2026-05-26T14:00:00Z"))
                .updatedAt(Instant.parse("2026-05-26T14:00:00Z"))
                .build();

        PhotographyPackage weddingPackage = PhotographyPackage.builder()
                .id(2L)
                .name("Wedding Highlights")
                .description("Four-hour wedding coverage")
                .priceInCents(80000)
                .durationMinutes(240)
                .active(true)
                .createdAt(Instant.parse("2026-05-26T14:05:00Z"))
                .updatedAt(Instant.parse("2026-05-26T14:05:00Z"))
                .build();

        when(packageRepository.findByActiveTrueOrderByNameAsc())
                .thenReturn(List.of(portraitPackage, weddingPackage));

        List<PhotographyPackageResponse> responses = photographyPackageService.findAllActive();

        assertThat(responses)
                .hasSize(2)
                .extracting(PhotographyPackageResponse::name)
                .containsExactly("Portrait Session", "Wedding Highlights");

        assertThat(responses.getFirst().priceInCents()).isEqualTo(15000);
        assertThat(responses.getLast().durationMinutes()).isEqualTo(240);
    }
}
