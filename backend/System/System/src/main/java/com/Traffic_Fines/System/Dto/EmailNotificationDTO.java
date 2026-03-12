package com.Traffic_Fines.System.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class EmailNotificationDTO {

    @NotBlank(message = "Email type is required")
    @Size(max = 50, message = "Email type must be at most 50 characters")
    private String emailType; // FINE_ISSUED, PAYMENT_REMINDER, etc.

    private LocalDateTime sentAt;

    @NotBlank(message = "Status is required")
    @Size(max = 20, message = "Status must be at most 20 characters")
    private String status; // SENT, FAILED, PENDING

    private String emailContent;

    @NotBlank(message = "Recipient email is required")
    @Email(message = "Invalid email format")
    @Size(max = 100, message = "Email must be at most 100 characters")
    private String recipientEmail;

    @Min(value = 1, message = "Driver is required")
    private int driverId;

    private Integer fineId; // Can be null for some email types
}
