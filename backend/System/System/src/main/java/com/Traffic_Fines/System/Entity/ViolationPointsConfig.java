package com.Traffic_Fines.System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Violation_Points_Config")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ViolationPointsConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "config_id")
    private int id;

    @Column(name = "points")
    private int points;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity_level", length = 20)
    private SeverityLevel severityLevel;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Severity Levels
    public enum SeverityLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    // Relationship with ViolationType (One-to-One)
    @OneToOne
    @JoinColumn(name = "violation_id", referencedColumnName = "violation_id")
    private ViolationType violationType;
}
