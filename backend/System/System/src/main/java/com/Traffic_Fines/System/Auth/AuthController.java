package com.Traffic_Fines.System.Auth;

import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Util.ValidationUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173/")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Login

    @PostMapping("/login")
    public ResponseEntity<Respons<?>> login(@RequestBody LoginDTO loginDTO) {
        try{
            Map<String, String> errors = ValidationUtil.validateObject(loginDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true,"Login successful",authService.login(loginDTO.getEmail(), loginDTO.getPassword())));
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, e.getMessage(), null));
        }
    }

    // Create new user
    @PostMapping("/register")
    public ResponseEntity<Respons<?>> createUser(@RequestBody RegisterDTO registerDTO) {
        try{
            Map<String, String> errors = ValidationUtil.validateObject(registerDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>( false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true,"register Successfully!", authService.createUser(registerDTO)));
        }catch (RuntimeException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Respons<?>> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            authService.forgotPassword(email);
            return ResponseEntity.ok(new Respons<>(true, "OTP sent to your email", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, e.getMessage(), null));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Respons<?>> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        boolean isValid = authService.verifyOtp(email, otp);
        if (isValid) {
            return ResponseEntity.ok(new Respons<>(true, "OTP verified successfully", null));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Invalid or expired OTP", null));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Respons<?>> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String newPassword = request.get("password");
            authService.resetPassword(email, newPassword);
            return ResponseEntity.ok(new Respons<>(true, "Password reset successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, e.getMessage(), null));
        }
    }

    @GetMapping("/logout/{userId}")
    public ResponseEntity<Respons<?>> logout(@PathVariable Integer userId) {
        return ResponseEntity.ok(new Respons<>(true,"Logout successful","user id:"+userId));
    }

}
