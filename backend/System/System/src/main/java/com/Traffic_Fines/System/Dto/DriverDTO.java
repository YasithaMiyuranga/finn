package com.Traffic_Fines.System.Dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@NoArgsConstructor
@AllArgsConstructor
@Data
public class DriverDTO {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be at most 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be at most 50 characters")
    private String lastName;

    @NotBlank(message = "User gender is mandatory or invalid")
    private String gender;

    @Min(value = 1, message = "User is required")
    private int licenseNumber;

    @NotNull(message = "Date of birth is required")
    @Past(message = "Date of birth must be a past date")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Phone number is required")
    @Size(max = 15, message = "Phone number must be at most 15 characters")
    private String phone;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Province is required")
    @Size(max = 50, message = "Province must be at most 50 characters")
    private String province;

    @NotBlank(message = "District is required")
    @Size(max = 50, message = "District must be at most 50 characters")
    private String district;

    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City must be at most 50 characters")
    private String city;

    @NotNull(message = "License issue date is required")
    @PastOrPresent(message = "License issue date must be in the past or present")
    private LocalDate licenseissue;

    @NotNull(message = "License expiry date is required")
    @FutureOrPresent(message = "License expiry date must be in the future or present")
    private LocalDate licenseExpiry;

    @Min(value = 1, message = "User is required")
    private int user;


}
