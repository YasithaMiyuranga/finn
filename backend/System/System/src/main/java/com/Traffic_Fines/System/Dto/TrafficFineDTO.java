package com.Traffic_Fines.System.Dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TrafficFineDTO {
    private int refNo;

    private String policeId;
    private String licenseId;
    private String vehicleNo;
    private String classOfVehicle;
    private String place;
    private LocalDate issuedDate;
    private LocalTime issuedTime;
    private LocalDate expireDate;
    private String court;
    private LocalDate courtDate;
    private String provisions;
    private double totalAmount;
    private String status;

    // IDs for Hibernate relations
    @Min(value = 1, message = "Driver ID is required")
    private int driverId;

    @Min(value = 1, message = "Officer ID is required")
    private int officerId;

    @Min(value = 1, message = "Violation ID is required")
    private int violationId;
}
