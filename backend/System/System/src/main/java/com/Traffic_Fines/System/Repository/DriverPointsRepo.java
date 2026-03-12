package com.Traffic_Fines.System.Repository;

import com.Traffic_Fines.System.Entity.DriverPoints;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DriverPointsRepo extends JpaRepository<DriverPoints, Integer> {

    // Custom findById method
    DriverPoints findById(int id);

    // Find points by driver ID
    @Query("SELECT dp FROM DriverPoints dp WHERE dp.driver.id = :driverId")
    Optional<DriverPoints> findByDriverId(@Param("driverId") int driverId);

    // Find all drivers with specific status
    List<DriverPoints> findByStatus(String status);

    // Find drivers approaching suspension (e.g., points >= 11)
    @Query("SELECT dp FROM DriverPoints dp WHERE dp.totalPoints >= :threshold ORDER BY dp.totalPoints DESC")
    List<DriverPoints> findByPointsGreaterThanEqual(@Param("threshold") int threshold);
}
