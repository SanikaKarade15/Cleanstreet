package com.skyfleet.rentals.controller;

import com.skyfleet.rentals.dto.DroneRequestDTO;
import com.skyfleet.rentals.dto.DroneResponseDTO;

import com.skyfleet.rentals.service.DroneService;

import lombok.AllArgsConstructor;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drones")
@AllArgsConstructor
public class DroneController {

    private DroneService droneService;

    @PostMapping("/add/drone")
    public ResponseEntity<DroneResponseDTO> createDrone(@RequestBody DroneRequestDTO drone) {
        return ResponseEntity.ok(droneService.saveDrone(drone));
    }

    @GetMapping
    public ResponseEntity<List<DroneResponseDTO>> getAllDrones() {
        return ResponseEntity.ok(droneService.getAllDrones());
    }

    @GetMapping("getById/{id}")
    public ResponseEntity<DroneResponseDTO> getDroneById(@PathVariable Long id) {
    	return ResponseEntity.ok(droneService.getDroneById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDrone(@PathVariable Long id) {
        droneService.deleteDrone(id);
        return ResponseEntity.noContent().build();
    }
}