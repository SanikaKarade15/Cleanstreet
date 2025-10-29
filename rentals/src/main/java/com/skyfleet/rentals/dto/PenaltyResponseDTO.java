package com.skyfleet.rentals.dto;



import com.skyfleet.rentals.entity.PenaltyReasonStatus;
import com.skyfleet.rentals.entity.PenaltyStatus;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


@Getter
@Setter
public class PenaltyResponseDTO extends BaseDTO {   
	
    private Long id;

   
    private Long bookingId;

    private PenaltyReasonStatus penaltyReason;

    private BigDecimal penaltyAmount;

    private PenaltyStatus penaltyStatus; 
}
