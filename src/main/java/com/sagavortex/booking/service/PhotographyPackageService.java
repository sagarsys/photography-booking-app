package com.sagavortex.booking.service;

import com.sagavortex.booking.domain.PhotographyPackage;
import com.sagavortex.booking.dto.request.PhotographyPackageRequest;
import com.sagavortex.booking.dto.response.PhotographyPackageResponse;
import com.sagavortex.booking.exception.ResourceNotFoundException;
import com.sagavortex.booking.repository.PhotographyPackageRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class PhotographyPackageService {

    private final PhotographyPackageRepository packageRepository;

    public PhotographyPackageService(PhotographyPackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    public List<PhotographyPackageResponse> findAllActive() {
        return packageRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public PhotographyPackageResponse findById(Long id) {
        return toResponse(getPackageOrThrow(id));
    }

    @Transactional
    public PhotographyPackageResponse create(PhotographyPackageRequest request) {
        PhotographyPackage photographyPackage = PhotographyPackage.builder()
                .name(request.name())
                .description(request.description())
                .priceInCents(request.priceInCents())
                .durationMinutes(request.durationMinutes())
                .active(true)
                .build();

        return toResponse(packageRepository.save(photographyPackage));
    }

    @Transactional
    public PhotographyPackageResponse update(Long id, PhotographyPackageRequest request) {
        PhotographyPackage photographyPackage = getPackageOrThrow(id);

        photographyPackage.setName(request.name());
        photographyPackage.setDescription(request.description());
        photographyPackage.setPriceInCents(request.priceInCents());
        photographyPackage.setDurationMinutes(request.durationMinutes());

        return toResponse(packageRepository.save(photographyPackage));
    }

    @Transactional
    public void deactivate(Long id) {
        PhotographyPackage photographyPackage = getPackageOrThrow(id);
        photographyPackage.setActive(false);
        packageRepository.save(photographyPackage);
    }

    private PhotographyPackage getPackageOrThrow(Long id) {
        return packageRepository.findById(id)
                .filter(PhotographyPackage::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Photography package not found: " + id));
    }

    private PhotographyPackageResponse toResponse(PhotographyPackage photographyPackage) {
        return new PhotographyPackageResponse(
                photographyPackage.getId(),
                photographyPackage.getName(),
                photographyPackage.getDescription(),
                photographyPackage.getPriceInCents(),
                photographyPackage.getDurationMinutes(),
                photographyPackage.isActive(),
                photographyPackage.getCreatedAt(),
                photographyPackage.getUpdatedAt()
        );
    }
}
