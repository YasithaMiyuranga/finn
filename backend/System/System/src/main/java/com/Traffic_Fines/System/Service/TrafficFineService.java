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

import java.util.List;

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

        ViolationType violation = violationTypeRepo.findById(dto.getViolationId());
        if (violation == null) return new Respons<>(false, "invalid violation id", null);

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
}