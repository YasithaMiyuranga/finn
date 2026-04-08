package com.Traffic_Fines.System.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PoliceOICDTO {
    private int id;
    private int policeid;
    private String fullName;
    private String email;
    private String phone;
    private LocalDate registeredDate;
    private String officerRank;
    private String province;
    private String district;
    private String city;
    private Integer userId;
    
    // For account creation
    private String password;
}
