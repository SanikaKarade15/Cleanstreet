package com.skyfleet.rentals.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;



import com.skyfleet.rentals.entity.BookingStatus;
import com.skyfleet.rentals.entity.DeliveryStatus;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class BookingResponseDTO extends BaseDTO {
	
	 
	    private Long id;

	    
	    private Long userId;

	    
	    private Long droneId;
	    
	    
	    
	    private LocalDateTime bookingDateTime;
	    
	 
	 	private LocalDateTime deliveryDateTime;

	    
	    private LocalDateTime startTime;

	    private LocalDateTime endTime;


	    private BigDecimal totalAmount;

	   
	    private BookingStatus status; // Enum for booking status
	    

	    private DeliveryStatus deliverStatus;

	    private UserResponseDTO user;
	    private DroneResponseDTO drone;
}
