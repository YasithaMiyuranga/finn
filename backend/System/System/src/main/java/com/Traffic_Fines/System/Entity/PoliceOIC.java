package com.Traffic_Fines.System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Police_OIC")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PoliceOIC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "policeid", unique = true, nullable = false, length = 20)
    private int policeid;

    @Column(name = "fullName", length = 100)
    private String fullName;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "registered_date")
    private LocalDate registeredDate = LocalDate.now();

    @Column(name = "officer_rank", length = 50)
    private String officerRank;

    @Column(name = "province", length = 50)
    private String province;

    @Column(name = "district", length = 50)
    private String district;

    @Column(name = "city", length = 50)
    private String city;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;
}