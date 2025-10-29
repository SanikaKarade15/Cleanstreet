package com.skyfleet.rentals.dto;



import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PaymentRequestDTO extends BaseDTO {

    private Long bookingId;

    private BigDecimal amountPaid;


     // Enum for payment status
}
