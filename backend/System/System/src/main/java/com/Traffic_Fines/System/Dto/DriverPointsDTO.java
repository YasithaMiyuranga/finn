package com.Traffic_Fines.System.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DriverPointsDTO {

    @NotNull(message = "Total points is required")
    @Min(value = 0, message = "Total points cannot be negative")
    private int totalPoints;

    private LocalDate lastUpdated;

    @NotBlank(message = "Status is required")
    @Size(max = 20, message = "Status must be at most 20 characters")
    private String status; // ACTIVE, WARNING, SUSPENDED

    private String suspensionReason;

    @Min(value = 1, message = "Driver is required")
    private int driverId;
}
