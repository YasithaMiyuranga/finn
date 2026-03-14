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

