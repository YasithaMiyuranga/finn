package com.Traffic_Fines.System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Police_Officers")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Police_Officers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "officer_id")
    private int id;

    @Column(name = "fullName", length = 50)
    private String fullName;

    @Column(name = "policeid", unique = true, nullable = false, length = 20)
    private int policeid;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Driver.Gender gender = Driver.Gender.Male;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "province", nullable = false)
    private Driver.Province province = Driver.Province.Southern;

    @Column(name = "district", length = 50)
    private String district;

    @Column(name = "police_station", length = 100)
    private String policeStation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @OneToMany(mappedBy = "policeOfficer", cascade = CascadeType.ALL)
    private List<TrafficFine> trafficFine;

    // New relationship for grievance reports
    @OneToMany(mappedBy = "accusedOfficer", cascade = CascadeType.ALL)
    private List<GrievanceReport> grievancesAgainst;
}