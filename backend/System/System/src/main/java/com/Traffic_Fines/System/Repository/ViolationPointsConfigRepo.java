package com.Traffic_Fines.System.Repository;

import com.Traffic_Fines.System.Entity.ViolationPointsConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ViolationPointsConfigRepo extends JpaRepository<ViolationPointsConfig, Integer> {

    // Custom findById method
    ViolationPointsConfig findById(int id);

    // Find config by violation type ID
    @Query("SELECT vpc FROM ViolationPointsConfig vpc WHERE vpc.violationType.id = :violationTypeId")
    Optional<ViolationPointsConfig> findByViolationTypeId(@Param("violationTypeId") int violationTypeId);
}
