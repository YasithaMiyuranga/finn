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
public class ViolationTypeDTO {

    @NotBlank(message = "Violation description is required")
    private String violationDescription;

    @NotBlank(message = "SL law reference is required")
    @Size(max = 100, message = "SL law reference must be at most 100 characters")
    private String slLawReference;

    @NotNull(message = "Amount is required")
    @Min(value = 0, message = "Amount cannot be a negative number")
    private int amount;



}
