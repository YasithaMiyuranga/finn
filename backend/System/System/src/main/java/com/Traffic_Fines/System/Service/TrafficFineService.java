package com.Traffic_Fines.System.Service;

import com.Traffic_Fines.System.Dto.TrafficFineDTO;
import com.Traffic_Fines.System.Entity.Driver;
import com.Traffic_Fines.System.Entity.Police_Officers;
import com.Traffic_Fines.System.Entity.TrafficFine;
import com.Traffic_Fines.System.Entity.ViolationType;
import com.Traffic_Fines.System.Repository.*;
import com.Traffic_Fines.System.Respons.Respons;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TrafficFineService {

    @Autowired
    private TrafficFineRepo trafficFineRepo;

    @Autowired
    private Police_OfficersRepo policeOfficerRepo;

    @Autowired
    private DriverRepo driverRepo;

    @Autowired
    private ViolationTypeRepo violationTypeRepo;

    @Autowired
    private PendingFineRepo pendingFineRepo;

    public Respons<Integer> saveTrafficFine(TrafficFineDTO dto) {

        // Internal relational lookups
        Driver driver = driverRepo.findById(dto.getDriverId());
        if (driver == null) return new Respons<>(false, "invalid driver id", null);

        Police_Officers officer = policeOfficerRepo.findById(dto.getOfficerId());
        if (officer == null) return new Respons<>(false, "invalid officer id", null);

        // Validate all violation IDs and sum points
        int totalPoints = 0;
        for (Integer vId : dto.getViolationIds()) {
            if (vId == null) continue; // Skip if null to avoid exception
            ViolationType v = violationTypeRepo.findById(vId).orElse(null);
            if (v == null) return new Respons<>(false, "invalid violation id: " + vId, null);
            totalPoints += v.getPoints();
        }

        // Map DTO to Entity (Matching PHP Structure)
        TrafficFine fine = new TrafficFine();
        
        fine.setPoliceId(dto.getPoliceId());
        fine.setLicenseId(dto.getLicenseId());
        fine.setVehicleNo(dto.getVehicleNo());
        fine.setClassOfVehicle(dto.getClassOfVehicle());
        fine.setPlace(dto.getPlace());
        fine.setIssuedDate(dto.getIssuedDate());
        fine.setIssuedTime(dto.getIssuedTime());
        fine.setExpireDate(dto.getExpireDate());
        fine.setCourt(dto.getCourt());
        fine.setCourtDate(dto.getCourtDate());
        fine.setProvisions(dto.getProvisions());
        fine.setTotalAmount(dto.getTotalAmount());
        fine.setPoints(totalPoints); // Set total points
        fine.setStatus(dto.getStatus() != null ? dto.getStatus() : "pending");

        // Save Fine
        TrafficFine savedFine = trafficFineRepo.save(fine);

        // Also save to PendingFine for dashboard visibility
        com.Traffic_Fines.System.Entity.PendingFine pending = new com.Traffic_Fines.System.Entity.PendingFine();
        pending.setDriver(driver);
        pending.setFine(savedFine);
        pending.setOicReviewStatus("PENDING");
        pendingFineRepo.save(pending);

        return new Respons<>(true, "Traffic Fine added successfully", savedFine.getRefNo());
    }

    public int getDriverPointsInLast7Days(String licenseId) {
        LocalDate startDate = LocalDate.now().minusDays(7);
        Integer points = trafficFineRepo.sumPointsByLicenseIdAndIssuedDateAfter(licenseId, startDate);
        return points != null ? points : 0;
    }

    public Respons<Integer> updateTrafficFine(int id, TrafficFineDTO dto) {
        TrafficFine existing = trafficFineRepo.findById(id);
        if (existing == null) return new Respons<>(false, "Fine not found", null);

        existing.setVehicleNo(dto.getVehicleNo());
        existing.setPlace(dto.getPlace());
        existing.setExpireDate(dto.getExpireDate());
        existing.setCourt(dto.getCourt());
        existing.setCourtDate(dto.getCourtDate());
        existing.setProvisions(dto.getProvisions());
        existing.setTotalAmount(dto.getTotalAmount());
        existing.setStatus(dto.getStatus());

        trafficFineRepo.save(existing);
        return new Respons<>(true, "Traffic Fine updated successfully", id);
    }

    public Respons<Integer> deleteTrafficFine(int id) {
        if (!trafficFineRepo.existsById(id)) return new Respons<>(false, "Fine not found", null);
        trafficFineRepo.deleteById(id);
        return new Respons<>(true, "Traffic Fine deleted successfully", id);
    }

    public List<TrafficFine> getAllTrafficFines() {
        return trafficFineRepo.findAll();
    }

    public Optional<TrafficFine> getTrafficFineById(int id) {
        return Optional.ofNullable(trafficFineRepo.findById(id));
    }

    public Respons<Integer> payFine(int refNo) {
        TrafficFine fine = trafficFineRepo.findById(refNo);
        if (fine == null) return new Respons<>(false, "Fine not found", null);

        // 1. Update status to PAID
        fine.setStatus("PAID");
        fine.setPaidDate(LocalDate.now());
        trafficFineRepo.save(fine);

        // 2. Remove from PendingFine
        Optional<com.Traffic_Fines.System.Entity.PendingFine> pending = pendingFineRepo.findByFine(fine);
        pending.ifPresent(p -> pendingFineRepo.delete(p));

        return new Respons<>(true, "Fine paid successfully", refNo);
    }

    public List<TrafficFine> getFinesByLicenseId(String licenseId) {
        return trafficFineRepo.findByLicenseId(licenseId);
    }

    public java.util.Map<String, Object> getOfficerPerformance(String policeId) {
        long count = trafficFineRepo.countByPoliceId(policeId);
        Double sum = trafficFineRepo.sumAmountByPoliceId(policeId);
        
        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("reportedFineCount", count);
        stats.put("reportedFineAmount", sum != null ? sum : 0.0);
        return stats;
    }

    public java.util.Map<String, Object> getDriverStats(String licenseId) {
        long pendingCount = trafficFineRepo.countByLicenseIdAndStatus(licenseId, "pending");
        Double pendingSum = trafficFineRepo.sumAmountByLicenseIdAndStatus(licenseId, "pending");
        
        long paidCount = trafficFineRepo.countByLicenseIdAndStatus(licenseId, "PAID");
        Double paidSum = trafficFineRepo.sumAmountByLicenseIdAndStatus(licenseId, "PAID");
        
        long totalCount = trafficFineRepo.countByLicenseId(licenseId);
        Double totalSum = trafficFineRepo.sumAmountByLicenseId(licenseId);

        java.util.Map<String, Object> stats = new java.util.HashMap<>();
        stats.put("pendingFineCount", pendingCount);
        stats.put("pendingFineAmount", pendingSum != null ? pendingSum : 0.0);
        stats.put("paidFineCount", paidCount);
        stats.put("paidFineAmount", paidSum != null ? paidSum : 0.0);
        stats.put("totalFineTicketsCount", totalCount);
        stats.put("totalFineTicketsAmount", totalSum != null ? totalSum : 0.0);
        
        return stats;
    }
}