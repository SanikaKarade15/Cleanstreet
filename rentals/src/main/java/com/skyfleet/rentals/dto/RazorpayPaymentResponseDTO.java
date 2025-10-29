package com.skyfleet.rentals.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RazorpayPaymentResponseDTO {
	
	
	private String razorpayPaymentId;
	private String razorpayOrderId;
	private String razorpaySignature;

}
