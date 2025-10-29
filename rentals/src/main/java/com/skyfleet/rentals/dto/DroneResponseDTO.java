package com.skyfleet.rentals.dto;


import com.skyfleet.rentals.entity.DroneStatus;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DroneResponseDTO extends BaseDTO {

	 
	    private String model;

	    private String brand;

	    private DroneStatus status;

	    
	    private Double pricePerHour;

	    
	    private Integer batteryLife;

	    
	    private String location;

	    
	    private String imageUrl;

	    
	    private String guideUrl;
}
