package com.Traffic_Fines.System.Auth;

import com.Traffic_Fines.System.Entity.User;
import com.Traffic_Fines.System.Repository.UserRepo;
import com.Traffic_Fines.System.Respons.LoginResponse;
import com.Traffic_Fines.System.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private com.Traffic_Fines.System.Repository.DriverRepo driverRepo;

    @Autowired
    private com.Traffic_Fines.System.Service.EmailService emailService;

    public void forgotPassword(String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User with email " + email + " not found");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        user.setOtp(otp);
        user.setOtpExpiry(java.time.LocalDateTime.now().plusMinutes(5));
        userRepo.save(user);

        // Send Email
        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {
        User user = userRepo.findByEmail(email);
        if (user == null || user.getOtp() == null || !user.getOtp().equals(otp)) {
            return false;
        }

        if (user.getOtpExpiry().isBefore(java.time.LocalDateTime.now())) {
            return false; // Expired
        }

        return true;
    }

    public void resetPassword(String email, String newPassword) {
        User user = userRepo.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null); // Clear OTP after success
        user.setOtpExpiry(null);
        userRepo.save(user);
    }

    public LoginResponse login(String email, String password){
        User user = userRepo.findByEmail(email);
        if(user != null){
            if(passwordEncoder.matches(password, user.getPassword())){
                Map<String, Object> jwtData = new HashMap<>();
                jwtData.put("email",email);
                jwtData.put("role",user.getUserType());
                String token = jwtUtil.createToken(jwtData);
                
                boolean profileComplete = false;
                if (user.getUserType().toString().equalsIgnoreCase("DRIVER")) {
                    profileComplete = (driverRepo.findByUser(user.getId()) != null);
                } else {
                    // For other roles, we can assume true or handle differently
                    profileComplete = true; 
                }
                
                return new LoginResponse(user.getId(), token, user.getUserType().toString(), profileComplete);
            }
        }
        throw new RuntimeException("Invalid email or password");
    }

    public int createUser(RegisterDTO registerDTO) {
        if (userRepo.existsByEmail(registerDTO.getEmail())) {
            throw new RuntimeException("User with email '" + registerDTO.getEmail() + "' already exists");
        }

        User user = new User();
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user.setUserType(registerDTO.getUserType());

        User savedUser = userRepo.save(user);
        return savedUser.getId();
    }
}

