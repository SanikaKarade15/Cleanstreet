package com.skyfleet.rentals.service;

import com.skyfleet.rentals.dto.RatingRequestDTO;
import com.skyfleet.rentals.dto.RatingResponseDTO;
import com.skyfleet.rentals.entity.Rating;
import java.util.List;

public interface RatingService {
    RatingResponseDTO saveRating(RatingRequestDTO rating);
    List<RatingResponseDTO> getAllRatings();
    RatingResponseDTO getRatingById(Long id);
    void deleteRating(Long id);
    List<RatingResponseDTO> getRatingsByBookingId(Long bookingId);
}