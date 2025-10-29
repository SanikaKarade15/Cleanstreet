package com.skyfleet.rentals.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


import com.skyfleet.rentals.entity.BookingStatus;
import com.skyfleet.rentals.entity.DeliveryStatus;
import com.skyfleet.rentals.entity.Drone;
import com.skyfleet.rentals.entity.Payment;
import com.skyfleet.rentals.entity.Penalty;
import com.skyfleet.rentals.entity.Rating;
import com.skyfleet.rentals.entity.Undertaking;
import com.skyfleet.rentals.entity.User;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class MyBookingsDTO {
	

    private Long id;

    private User user;
    

    private Drone drone;
    
    private LocalDateTime bookingDateTime;
    
 	private LocalDateTime deliveryDateTime;

    private LocalDateTime startTime;


    private LocalDateTime endTime;

    private BigDecimal totalAmount;

    private BookingStatus status; // Enum for booking status

    private DeliveryStatus deliverStatus;

    private List<Payment> payments;

    private List<Penalty> penalties;

    private List<Undertaking> undertakings;

    private List<Rating> ratings;
    
    
    
   

}
