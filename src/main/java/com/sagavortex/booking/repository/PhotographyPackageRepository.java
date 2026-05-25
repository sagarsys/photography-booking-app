package com.sagavortex.booking.repository;

import com.sagavortex.booking.domain.PhotographyPackage;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotographyPackageRepository extends JpaRepository<PhotographyPackage, Long> {

    List<PhotographyPackage> findByActiveTrueOrderByNameAsc();
}
