package com.Traffic_Fines.System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "ViolationType")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ViolationType {

    @Id
    @Column(name = "violation_id")
    private int id;

    @Column(name = "violation_description", columnDefinition = "TEXT")
    private String violationDescription;

    @Column(name = "sl_law_reference", length = 100)
    private String slLawReference;

    @Column(name = "amount")
    private int amount;


    @Column(name = "points")
    private int points;

    public enum SeverityLevel {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "severity_level", length = 20)
    private SeverityLevel severityLevel;
}
