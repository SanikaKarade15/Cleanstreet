package com.skyfleet.rentals.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private String tokenType = "Bearer";
    private UserResponseDTO user;
    private String message;
    
    public AuthResponseDTO(String token, UserResponseDTO user) {
        this.token = token;
        this.user = user;
        this.message = "Authentication successful";
    }
} 