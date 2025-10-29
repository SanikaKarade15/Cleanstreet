package com.skyfleet.rentals.dto;

import com.skyfleet.rentals.entity.RatingValue;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RatingResponseDTO extends BaseDTO {
    private Long bookingId;
    private Long userId;
    private Long droneId;
    private RatingValue rating; // Enum for rating values
    private String comment;
    private String userName;
    private String droneModel;
}
