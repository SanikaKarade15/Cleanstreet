package com.skyfleet.rentals.service;

import com.skyfleet.rentals.dto.PenaltyRequestDTO;
import com.skyfleet.rentals.dto.PenaltyResponseDTO;
import com.skyfleet.rentals.entity.Booking;
import com.skyfleet.rentals.entity.Penalty;
import com.skyfleet.rentals.entity.PenaltyReasonStatus;

import java.util.List;

public interface PenaltyService {
    PenaltyResponseDTO savePenalty(PenaltyRequestDTO penalty);
    List<PenaltyResponseDTO> getAllPenalties();
    PenaltyResponseDTO getPenaltyById(Long id);
    void deletePenalty(Long id);
    List<PenaltyResponseDTO> getPenaltiesByBookingId(Long bookingId);
   Penalty calculatePenalty(Booking booking, PenaltyReasonStatus penaltyReason);
}