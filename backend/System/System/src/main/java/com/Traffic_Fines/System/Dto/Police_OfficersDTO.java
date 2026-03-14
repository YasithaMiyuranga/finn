package com.Traffic_Fines.System.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Police_OfficersDTO {

    @NotBlank(message = "fullName is required")
    @Size(max = 50, message = "fullName must be at most 50 characters")
    private String fullName;

    @Min(value = 1, message = "User is required (policeid)")
    private int policeid;

    // Optional fields initially (filled later during profile completion)
    private String gender;
    
    @Past(message = "Date of birth must be a past date")
    private LocalDate dateOfBirth;

    @Size(max = 15, message = "Phone number must be at most 15 characters")
    private String phone;

    private String address;

    @Size(max = 50, message = "Province must be at most 50 characters")
    private String province;

    @Size(max = 50, message = "District must be at most 50 characters")
    private String district;

    @NotBlank(message = "Police station is required")
    @Size(max = 100, message = "Police station name must be at most 100 characters")
    private String policeStation;

    @Size(max = 100, message = "Court name must be at most 100 characters")
    private String court;

    private LocalDate registeredDate;

    // Optional: if not provided from frontend during creation, backend uses user repo logic
    private int user;
}