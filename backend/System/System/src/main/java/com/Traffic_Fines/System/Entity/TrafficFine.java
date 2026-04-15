package com.Traffic_Fines.System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "traffic_fine")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TrafficFine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ref_no")
    private int refNo;

    @Column(name = "police_id", length = 20)
    private String policeId;

    @Column(name = "license_id", length = 20)
    private String licenseId;

    @Column(name = "vehical_no", length = 20)
    private String vehicleNo;

    @Column(name = "class_of_vehicle", length = 20)
    private String classOfVehicle;

    @Column(name = "place", length = 100)
    private String place;

    @Column(name = "issued_date")
    private LocalDate issuedDate;

    @Column(name = "issued_time")
    private LocalTime issuedTime;

    @Column(name = "expire_date")
    private LocalDate expireDate;

    @Column(name = "court", length = 100)
    private String court;

    @Column(name = "court_date")
    private LocalDate courtDate;

    @Column(name = "provisions", length = 1000)
    private String provisions;

    @Column(name = "total_amount")
    private double totalAmount;

    @Column(name = "status", length = 20)
    private String status;

    @Column(name = "paid_date")
    private LocalDate paidDate;

}
