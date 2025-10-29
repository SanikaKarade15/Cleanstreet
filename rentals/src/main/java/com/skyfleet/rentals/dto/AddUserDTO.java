package com.skyfleet.rentals.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddUserDTO {
	private String name;
	private String email;
	private String password;
	private String phone;
	private String address;
}
