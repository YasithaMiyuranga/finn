package com.Traffic_Fines.System.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PendingFineDTO {

    @NotNull(message = "Last reminder sent date is required")
    private LocalDate lastReminderSent;

    @NotBlank(message = "OIC review status is required")
    @Size(max = 20, message = "OIC review status must be at most 20 characters")
    private String oicReviewStatus;

    @Min(value = 1,message = "Driver is required")
    private int driver;

    @Min(value = 1,message = "Fine is required")
    private int fine;
}
