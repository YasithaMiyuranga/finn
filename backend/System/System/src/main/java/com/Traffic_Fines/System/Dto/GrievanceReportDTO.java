package com.Traffic_Fines.System.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class GrievanceReportDTO {

    @NotBlank(message = "Complaint details are required")
    private String complaintDetails;

    private LocalDateTime reportedAt;

    @NotBlank(message = "Status is required")
    @Size(max = 20, message = "Status must be at most 20 characters")
    private String status; // PENDING, INVESTIGATING, RESOLVED, REJECTED

    private String resolution;

    private LocalDateTime resolvedAt;

    @Min(value = 1, message = "Reporter driver is required")
    private int reporterDriverId;

    private Integer accusedOfficerId; // Can be null
}
