package com.Traffic_Fines.System.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ViolationPointsConfigDTO {

    @NotNull(message = "Points is required")
    @Min(value = 0, message = "Points cannot be negative")
    private int points;

    @NotBlank(message = "Severity level is required")
    @Size(max = 20, message = "Severity level must be at most 20 characters")
    private String severityLevel; // LOW, MEDIUM, HIGH, CRITICAL

    private String description;

    @Min(value = 1, message = "Violation type is required")
    private int violationTypeId;
}
