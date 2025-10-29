package com.skyfleet.rentals.dto;



import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;


@Getter
@Setter
public class UndertakingResponseDTO extends BaseDTO {

	 
	
    private Long id;

    
    private Long bookingId;

    
    private Boolean isAccepted;

    
    private BigDecimal depositAmount;

    
    private String damageClauseText;
}
