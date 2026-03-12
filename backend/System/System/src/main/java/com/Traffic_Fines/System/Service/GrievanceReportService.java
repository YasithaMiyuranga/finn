package com.Traffic_Fines.System.Service;

import com.Traffic_Fines.System.Dto.GrievanceReportDTO;
import com.Traffic_Fines.System.Entity.Driver;
import com.Traffic_Fines.System.Entity.GrievanceReport;
import com.Traffic_Fines.System.Entity.Police_Officers;
import com.Traffic_Fines.System.Repository.DriverRepo;
import com.Traffic_Fines.System.Repository.GrievanceReportRepo;
import com.Traffic_Fines.System.Repository.Police_OfficersRepo;
import com.Traffic_Fines.System.Respons.Respons;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class GrievanceReportService {

    @Autowired
    private GrievanceReportRepo grievanceRepo;

    @Autowired
    private DriverRepo driverRepo;

    @Autowired
    private Police_OfficersRepo officersRepo;

    public Respons submitGrievance(GrievanceReportDTO dto) {
        Driver driver = driverRepo.findById(dto.getReporterDriverId());
        if (driver == null) {
            return new Respons<>(false, "Invalid driver ID", null);
        }

        GrievanceReport report = new GrievanceReport();
        report.setComplaintDetails(dto.getComplaintDetails());
        report.setReportedAt(LocalDateTime.now());
        report.setStatus(GrievanceReport.GrievanceStatus.PENDING);
        report.setReporterDriver(driver);

        if (dto.getAccusedOfficerId() != null) {
            Police_Officers officer = officersRepo.findById(dto.getAccusedOfficerId()).orElse(null);
            report.setAccusedOfficer(officer);
        }

        GrievanceReport saved = grievanceRepo.save(report);
        return new Respons<>(true, "Grievance submitted successfully", saved.getId());
    }

    public Respons getMyGrievances(int driverId) {
        List<GrievanceReport> reports = grievanceRepo.findByReporterDriverId(driverId);
        return new Respons<>(true, "Grievances retrieved", reports);
    }

    public Respons getAllGrievances() {
        List<GrievanceReport> reports = grievanceRepo.findAll();
        return new Respons<>(true, "All grievances retrieved", reports);
    }

    public Respons updateGrievanceStatus(int grievanceId, String status, String resolution) {
        GrievanceReport report = grievanceRepo.findById(grievanceId);
        if (report == null) {
            return new Respons<>(false, "Invalid grievance ID", null);
        }

        report.setStatus(GrievanceReport.GrievanceStatus.valueOf(status));
        report.setResolution(resolution);

        if ("RESOLVED".equals(status) || "REJECTED".equals(status)) {
            report.setResolvedAt(LocalDateTime.now());
        }

        grievanceRepo.save(report);
        return new Respons<>(true, "Grievance status updated", grievanceId);
    }

    public Respons getPendingGrievances() {
        List<GrievanceReport> reports = grievanceRepo.findByStatusOrderByReportedAtDesc(
                GrievanceReport.GrievanceStatus.PENDING);
        return new Respons<>(true, "Pending grievances retrieved", reports);
    }
}
