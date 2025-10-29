package com.skyfleet.rentals.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateDTO {
    @NotBlank(message = "Name is required")
    @Pattern(regexp = "^[a-zA-Z\\s]{2,50}$", message = "Name should contain only letters and be 2-50 characters long")
    private String name;
    
    @Email(message = "Please enter a valid email address")
    @NotBlank(message = "Email is required")
    private String email;
    
    // ✅ Enhanced phone validation - only digits, 10 characters
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;
    
    @NotBlank(message = "Address is required")
    @Pattern(regexp = "^.{10,200}$", message = "Address must be between 10-200 characters")
    private String address;
}
