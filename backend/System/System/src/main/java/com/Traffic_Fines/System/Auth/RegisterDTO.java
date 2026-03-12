package com.Traffic_Fines.System.Auth;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.Traffic_Fines.System.Entity.User;

@Data
@NoArgsConstructor
public class RegisterDTO {

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is mandatory")
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Confirm Password is mandatory")
    private String confirmPassword;
    @AssertTrue(message = "Password and Confirm Password must match")
    public boolean isPasswordMatching() {
        if (password == null || confirmPassword == null) {
            return false;
        }
        return password.equals(confirmPassword);
    }

    private User.UserType userType;


}