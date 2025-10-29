package com.skyfleet.rentals.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.skyfleet.rentals.entity.BookingStatus;
import com.skyfleet.rentals.entity.DeliveryStatus;
import com.skyfleet.rentals.entity.Undertaking;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class BookingRequestDTO extends BaseDTO {
	
	private Long userId;
	
	private Long droneId;

	    
	    private LocalDateTime startTime;

	    
	    private LocalDateTime endTime;

	    
	    


	    private BookingStatus status; // Enum for booking status
	    
	   
	    private DeliveryStatus deliverStatus;
	   
	    private boolean undertakingIsAccepted;
	    private String address;

}
