package com.Traffic_Fines.System.Respons;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private int id;
    private String token;
    private String userType;
    private boolean profileComplete;
}
