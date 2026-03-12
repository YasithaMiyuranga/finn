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

    @Min(value = 1, message = "User is required")
    private int policeid;

    @NotBlank(message = "User gender is mandatory or invalid")
    private String gender;

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

    @NotBlank(message = "Police station is required")
    @Size(max = 100, message = "Police station name must be at most 100 characters")
    private String policeStation;


    @Min(value = 1, message = "User is required")
    private int user;
}