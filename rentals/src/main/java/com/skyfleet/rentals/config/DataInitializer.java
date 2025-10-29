package com.skyfleet.rentals.config;

import com.skyfleet.rentals.entity.Role;
import com.skyfleet.rentals.entity.Undertaking;
import com.skyfleet.rentals.entity.User;
import com.skyfleet.rentals.repository.UndertakingRepository;
import com.skyfleet.rentals.repository.UserRepository;

import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    
    private UndertakingRepository undertakingRepository;

    @Override
    public void run(String... args) throws Exception {
        // Creating admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@skyfleet.com")) {
            User adminUser = new User();
            adminUser.setName("Admin User");
            adminUser.setEmail("admin@skyfleet.com");
            adminUser.setPassword(passwordEncoder.encode("Admin123"));
            adminUser.setPhone("1234567890");
            adminUser.setAddress("Admin Address");
            adminUser.setRole(Role.ADMIN);
            userRepository.save(adminUser);
            System.out.println("Admin user created: admin@skyfleet.com / Admin123");
        }

        // Create test user if it doesn't exist
        if (!userRepository.existsByEmail("user@test.com")) {
            User testUser = new User();
            testUser.setName("Test User");
            testUser.setEmail("user@test.com");
            testUser.setPassword(passwordEncoder.encode("user123"));
            testUser.setPhone("9876543210");
            testUser.setAddress("Test Address");
            testUser.setRole(Role.USER);
            userRepository.save(testUser);
            System.out.println("Test user created: user@test.com / user123");
        }
        
        if(undertakingRepository.count()==0) {
        	Undertaking entity= new Undertaking();
        	entity.setDamageClauseText("I agree to pay for any damage caused to the drone during the rental period.");
        	entity.setUniquetext(true);
        	undertakingRepository.save(entity);
        	
        }
        
        
    }
} 