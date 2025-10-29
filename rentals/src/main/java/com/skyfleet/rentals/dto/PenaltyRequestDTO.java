package com.skyfleet.rentals.dto;



import com.fasterxml.jackson.annotation.JsonIgnore;
import com.skyfleet.rentals.entity.Booking;
import com.skyfleet.rentals.entity.PenaltyReasonStatus;
import com.skyfleet.rentals.entity.PenaltyStatus;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PenaltyRequestDTO extends BaseDTO {   
    private Long bookingId;
    private PenaltyReasonStatus penaltyReason;
}
