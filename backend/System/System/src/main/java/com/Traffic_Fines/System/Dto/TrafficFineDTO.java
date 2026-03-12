package com.Traffic_Fines.System.Dto;


import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TrafficFineDTO {

    @NotBlank(message = "Fine number is required")
    @Size(max = 20, message = "Fine number must be at most 20 characters")
    private String fineNumber;

    @NotNull(message = "Issue date is required")
    @PastOrPresent(message = "Issue date cannot be a future date")
    private LocalDate issueDate;

    @NotNull(message = "Issue time is required")
    private LocalTime issueTime;

    @NotBlank(message = "Location is required")
    @Size(max = 100, message = "Location must be at most 100 characters")
    private String location;

    @Min(value = 0, message = "Fine amount cannot be a negative number")
    private int fineAmount;

    @Min(value = 0, message = "Outstanding amount cannot be a negative number")
    private int outstandingAmount;

    @NotBlank(message = "Payment status is required")
    @Size(max = 20, message = "Payment status must be at most 20 characters")
    private String paymentStatus;

    @NotNull(message = "Payment due date is required")
    private LocalDate paymentDueDate;

    private boolean isNotificationSent;

    @Min(value = 1,message = "Driver is required")
    private int driver;

    @Min(value = 1,message = "Officer is required")
    private int policeOfficer;

    @Min(value = 1,message = "violation Type is required")
    private int violationType;
}

