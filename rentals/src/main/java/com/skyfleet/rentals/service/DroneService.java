package com.skyfleet.rentals.service;

import com.skyfleet.rentals.dto.DroneRequestDTO;
import com.skyfleet.rentals.dto.DroneResponseDTO;
import com.skyfleet.rentals.entity.Drone;
import java.util.List;

public interface DroneService {
    DroneResponseDTO saveDrone(DroneRequestDTO drone);
    List<DroneResponseDTO> getAllDrones();
    DroneResponseDTO getDroneById(Long id);
    void deleteDrone(Long id);
}