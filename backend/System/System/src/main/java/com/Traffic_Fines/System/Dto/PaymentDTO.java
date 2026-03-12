package com.Traffic_Fines.System.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PaymentDTO {

    @NotNull(message = "Payment date is required")
    private LocalDate paymentDate;

    @Min(value = 0, message = "Payment amount cannot be a negative number")
    private int paymentAmount;

    @NotBlank(message = "Payment method is required")
    @Size(max = 50, message = "Payment method must be at most 50 characters")
    private String paymentMethod;

    @NotBlank(message = "Transaction ID is required")
    @Size(max = 50, message = "Transaction ID must be at most 50 characters")
    private String transactionId;

    @Min(value = 1,message = "Driver is required")
    private int driver;
}
