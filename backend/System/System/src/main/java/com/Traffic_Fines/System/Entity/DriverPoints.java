package com.Traffic_Fines.System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "Driver_Points")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DriverPoints {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "points_id")
    private int id;

    @Column(name = "total_points")
    private int totalPoints;

    @Column(name = "last_updated")
    private LocalDate lastUpdated;

    @Column(name = "status", length = 20)
    private String status; // ACTIVE, WARNING, SUSPENDED

    @Column(name = "suspension_reason", columnDefinition = "TEXT")
    private String suspensionReason;

    // Relationship with Driver (One-to-One)
    @OneToOne
    @JoinColumn(name = "driver_id", referencedColumnName = "driver_id")
    private Driver driver;
}
