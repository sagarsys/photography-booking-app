package com.sagavortex.booking.controller;

import com.sagavortex.booking.dto.request.PhotographyPackageRequest;
import com.sagavortex.booking.dto.response.PhotographyPackageResponse;
import com.sagavortex.booking.service.PhotographyPackageService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/packages")
public class PhotographyPackageController {

    private final PhotographyPackageService packageService;

    public PhotographyPackageController(PhotographyPackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping
    public List<PhotographyPackageResponse> listPackages() {
        return packageService.findAllActive();
    }

    @GetMapping("/{id}")
    public PhotographyPackageResponse getPackage(@PathVariable Long id) {
        return packageService.findById(id);
    }

    @PostMapping
    public ResponseEntity<PhotographyPackageResponse> createPackage(
            @Valid @RequestBody PhotographyPackageRequest request) {
        PhotographyPackageResponse created = packageService.create(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();
        return ResponseEntity.created(location).body(created);
    }

    @PutMapping("/{id}")
    public PhotographyPackageResponse updatePackage(
            @PathVariable Long id,
            @Valid @RequestBody PhotographyPackageRequest request) {
        return packageService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivatePackage(@PathVariable Long id) {
        packageService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}
