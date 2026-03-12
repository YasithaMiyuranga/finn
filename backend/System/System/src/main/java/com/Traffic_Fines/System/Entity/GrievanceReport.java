package com.Traffic_Fines.System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Grievance_Reports")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class GrievanceReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grievance_id")
    private int id;

    @Column(name = "complaint_details", columnDefinition = "TEXT")
    private String complaintDetails;

    @Column(name = "reported_at")
    private LocalDateTime reportedAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private GrievanceStatus status;

    @Column(name = "resolution", columnDefinition = "TEXT")
    private String resolution;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    // Grievance Status
    public enum GrievanceStatus {
        PENDING, INVESTIGATING, RESOLVED, REJECTED
    }

    // Relationship with Driver (Reporter)
    @ManyToOne
    @JoinColumn(name = "reporter_driver_id")
    private Driver reporterDriver;

    // Relationship with Police Officer (Accused)
    @ManyToOne
    @JoinColumn(name = "accused_officer_id")
    private Police_Officers accusedOfficer;
}
