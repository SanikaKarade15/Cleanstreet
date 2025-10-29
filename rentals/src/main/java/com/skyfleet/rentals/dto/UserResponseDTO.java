package com.skyfleet.rentals.dto;

import com.skyfleet.rentals.entity.Role;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseDTO extends BaseDTO {

	private String name;
	private String email;
	private String phone;
	private String address;
	private Role role;
	
}