package com.skyfleet.rentals.repository;

import com.skyfleet.rentals.entity.Drone;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DroneRepository extends JpaRepository<Drone, Long> {
	
	
	boolean existsByModel(String model);
}