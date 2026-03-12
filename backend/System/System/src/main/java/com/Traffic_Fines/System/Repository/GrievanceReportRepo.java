package com.Traffic_Fines.System.Repository;

import com.Traffic_Fines.System.Entity.GrievanceReport;
import com.Traffic_Fines.System.Entity.GrievanceReport.GrievanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GrievanceReportRepo extends JpaRepository<GrievanceReport, Integer> {

    // Custom findById method
    GrievanceReport findById(int id);

    // Find grievances by reporter driver ID
    @Query("SELECT gr FROM GrievanceReport gr WHERE gr.reporterDriver.id = :driverId ORDER BY gr.reportedAt DESC")
    List<GrievanceReport> findByReporterDriverId(@Param("driverId") int driverId);

    // Find grievances by status
    List<GrievanceReport> findByStatusOrderByReportedAtDesc(GrievanceStatus status);

    // Find grievances against specific officer
    @Query("SELECT gr FROM GrievanceReport gr WHERE gr.accusedOfficer.id = :officerId ORDER BY gr.reportedAt DESC")
    List<GrievanceReport> findByAccusedOfficerId(@Param("officerId") int officerId);
}
