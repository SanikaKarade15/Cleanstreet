package com.skyfleet.rentals.controller;

import com.skyfleet.rentals.dto.ApiResponse;
import com.skyfleet.rentals.dto.UndertakingRequestDTO;
import com.skyfleet.rentals.dto.UndertakingResponseDTO;
import com.skyfleet.rentals.service.UndertakingService;

import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/undertakings")
@AllArgsConstructor
public class UndertakingController {

    
    private UndertakingService undertakingService;

    @PostMapping
    public ResponseEntity<?> createUndertaking(@RequestBody UndertakingRequestDTO undertaking) {
       undertakingService.saveUndertaking(undertaking);
    	
    	return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse("Undertaking Created"));
    }

    @GetMapping
    public ResponseEntity<List<UndertakingResponseDTO>> getAllUndertakings() {
        return ResponseEntity.ok(undertakingService.getAllUndertakings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UndertakingResponseDTO> getUndertakingById(@PathVariable Long id) {
    	return ResponseEntity.ok(undertakingService.getUndertakingById(id)); 
        
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUndertaking(@PathVariable Long id) {
        undertakingService.deleteUndertaking(id);
        return ResponseEntity.noContent().build();
    }
}