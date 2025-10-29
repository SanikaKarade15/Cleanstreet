package com.skyfleet.rentals;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class RentalsApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentalsApplication.class, args);
	}
	
	
	
	 @Bean //singleton n eager spring bean
	 ModelMapper modelMapper() {
		System.out.println("creating model mapper");
		//later we will configure ModelMapper bean ....
		 ModelMapper mapper=new ModelMapper();
		/*
		 * to specify to ModelMapper - transfer only MATCHING 
		 * props from src->dest
		 */
		 mapper.getConfiguration()
		 .setMatchingStrategy(MatchingStrategies.STRICT)
		 /*
		  * to specify to ModelMapper -
		  * do not transfer nulls
		  */
		.setPropertyCondition(Conditions.isNotNull());
		 return mapper;
		 
	}
	 
	

}
