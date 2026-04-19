package com.Traffic_Fines.System.Config;

import com.Traffic_Fines.System.Entity.User;
import com.Traffic_Fines.System.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataSeeder - Runs on application startup.
 * Creates default admin account if one does not already exist.
 *
 * Default Admin Credentials:
 *   Email   : admin@stfms.com
 *   Password: Admin@1234
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createAdminIfNotExists();
    }

    private void createAdminIfNotExists() {
        String adminEmail = "department@stfms.com";

        if (!userRepo.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("dep@123"));
            admin.setUserType(User.UserType.ADMIN);
            userRepo.save(admin);
            System.out.println("✅ Default Admin account created: " + adminEmail);
        } else {
            System.out.println("ℹ️ Admin account already exists. Skipping creation.");
        }
    }
}
