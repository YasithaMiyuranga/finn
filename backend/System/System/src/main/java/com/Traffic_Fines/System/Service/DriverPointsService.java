package com.Traffic_Fines.System.Service;

import com.Traffic_Fines.System.Dto.DriverPointsDTO;
import com.Traffic_Fines.System.Entity.Driver;
import com.Traffic_Fines.System.Entity.DriverPoints;
import com.Traffic_Fines.System.Repository.DriverPointsRepo;
import com.Traffic_Fines.System.Repository.DriverRepo;
import com.Traffic_Fines.System.Respons.Respons;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DriverPointsService {

    @Autowired
    private DriverPointsRepo driverPointsRepo;

    @Autowired
    private DriverRepo driverRepo;

    public Respons getDriverPoints(int driverId) {
        Optional<DriverPoints> points = driverPointsRepo.findByDriverId(driverId);
        if (points.isEmpty()) {
            return new Respons<>(false, "No points record found for driver", null);
        }
        return new Respons<>(true, "Driver points retrieved", points.get());
    }

    public Respons addPoints(int driverId, int points) {
        Driver driver = driverRepo.findById(driverId);
        if (driver == null) {
            return new Respons<>(false, "Invalid driver ID", null);
        }

        Optional<DriverPoints> existingPoints = driverPointsRepo.findByDriverId(driverId);
        DriverPoints driverPoints;

        if (existingPoints.isPresent()) {
            // Update existing points
            driverPoints = existingPoints.get();
            driverPoints.setTotalPoints(driverPoints.getTotalPoints() + points);
            driverPoints.setLastUpdated(LocalDate.now());

            // Check for suspension threshold (16+ points)
            if (driverPoints.getTotalPoints() >= 16) {
                driverPoints.setStatus("SUSPENDED");
                driverPoints.setSuspensionReason("Exceeded violation points threshold");
            } else if (driverPoints.getTotalPoints() >= 11) {
                driverPoints.setStatus("WARNING");
            }
        } else {
            // Create new points record
            driverPoints = new DriverPoints();
            driverPoints.setDriver(driver);
            driverPoints.setTotalPoints(points);
            driverPoints.setLastUpdated(LocalDate.now());
            driverPoints.setStatus("ACTIVE");
        }

        DriverPoints saved = driverPointsRepo.save(driverPoints);
        return new Respons<>(true, "Points updated successfully", saved);
    }

    public Respons getDriversApproachingSuspension() {
        List<DriverPoints> drivers = driverPointsRepo.findByPointsGreaterThanEqual(11);
        return new Respons<>(true, "Drivers at risk retrieved", drivers);
    }

    public Respons resetPoints(int driverId) {
        Optional<DriverPoints> points = driverPointsRepo.findByDriverId(driverId);
        if (points.isEmpty()) {
            return new Respons<>(false, "No points record found", null);
        }

        DriverPoints driverPoints = points.get();
        driverPoints.setTotalPoints(0);
        driverPoints.setStatus("ACTIVE");
        driverPoints.setSuspensionReason(null);
        driverPoints.setLastUpdated(LocalDate.now());

        driverPointsRepo.save(driverPoints);
        return new Respons<>(true, "Points reset successfully", driverPoints);
    }
}
