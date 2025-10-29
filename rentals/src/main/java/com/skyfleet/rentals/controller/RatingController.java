package com.skyfleet.rentals.controller;

import com.skyfleet.rentals.custom_exceptions.ApiException;
import com.skyfleet.rentals.dto.RatingRequestDTO;
import com.skyfleet.rentals.dto.RatingResponseDTO;
import com.skyfleet.rentals.entity.Rating;
import com.skyfleet.rentals.service.RatingService;

import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@AllArgsConstructor
public class RatingController {

   
    private RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingResponseDTO> createRating(@RequestBody RatingRequestDTO rating) {
        return ResponseEntity.ok(ratingService.saveRating(rating));
    }

    @GetMapping
    public ResponseEntity<List<RatingResponseDTO>> getAllRatings() {
        return ResponseEntity.ok(ratingService.getAllRatings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRatingById(@PathVariable Long id) {
       
    	
    	return ResponseEntity.ok(ratingService.getRatingById(id));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<RatingResponseDTO>> getRatingsByBooking(@PathVariable Long bookingId) {
        System.out.println("🎯 Controller: Getting ratings for booking ID: " + bookingId);
        
        try {
            List<RatingResponseDTO> ratings = ratingService.getRatingsByBookingId(bookingId);
            return ResponseEntity.ok(ratings);
        } catch (ApiException e) {
            System.err.println("❌ Error in rating controller: " + e.getMessage());
            throw e; // Let global exception handler deal with it
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable Long id) {
        ratingService.deleteRating(id);
        return ResponseEntity.noContent().build();
    }
}