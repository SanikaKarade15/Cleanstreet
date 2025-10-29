package com.skyfleet.rentals.controller;

import com.skyfleet.rentals.custom_exceptions.ApiException;
import com.skyfleet.rentals.dto.PenaltyRequestDTO;
import com.skyfleet.rentals.dto.PenaltyResponseDTO;
import com.skyfleet.rentals.entity.Penalty;
import com.skyfleet.rentals.service.PenaltyService;

import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/penalties")
@AllArgsConstructor
public class PenaltyController {

    
    private PenaltyService penaltyService;

    @PostMapping
    public ResponseEntity<PenaltyResponseDTO> createPenalty(@RequestBody PenaltyRequestDTO penalty) {
        return ResponseEntity.ok(penaltyService.savePenalty(penalty));
    }

    @GetMapping
    public ResponseEntity<List<PenaltyResponseDTO>> getAllPenalties() {
        return ResponseEntity.ok(penaltyService.getAllPenalties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PenaltyResponseDTO> getPenaltyById(@PathVariable Long id) {
    	
    	return ResponseEntity.ok(penaltyService.getPenaltyById(id));
      
    }
    
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PenaltyResponseDTO>> getPenaltiesByBooking(@PathVariable Long bookingId) {
        System.out.println("🎯 Controller: Getting penalties for booking ID: " + bookingId);
        
        try {
            List<PenaltyResponseDTO> penalties = penaltyService.getPenaltiesByBookingId(bookingId);
            return ResponseEntity.ok(penalties);
        } catch (ApiException e) {
            System.err.println("❌ Error in penalty controller: " + e.getMessage());
            throw e; // Let global exception handler deal with it
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePenalty(@PathVariable Long id) {
        penaltyService.deletePenalty(id);
        return ResponseEntity.noContent().build();
    }
}