package com.Traffic_Fines.System.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "Drivers")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "driver_id")
    private int id;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender = Gender.Male;

    @Column(name = "license_number", unique = true, nullable = false, length = 20)
    private int licenseNumber;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "phone", length = 15)
    private String phone;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "province", nullable = false)
    private Province province = Province.Southern;

    @Column(name = "district", length = 50)
    private String district;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "license_issue")
    private LocalDate licenseissue;

    @Column(name = "license_expiry")
    private LocalDate licenseExpiry;

    @Column(name = "class_of_vehicle", length = 50)
    private String classOfVehicle;

    @Column(name = "registered_date")
    private LocalDate registeredDate = LocalDate.now();

    @Column(name = "is_reactivated_by_oic")
    private Boolean isReactivatedByOIC = false;

    public enum Province {
        Western, Central, Southern, Northern, Eastern, North_Western, North_Central, Uva, Sabaragamuwa
    }

    public enum Gender {
        Male, Female, Other
    }

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL)
    private List<PendingFine> pendingFines;

}