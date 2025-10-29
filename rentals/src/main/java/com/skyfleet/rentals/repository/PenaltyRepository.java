package com.skyfleet.rentals.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skyfleet.rentals.entity.Penalty;

public interface PenaltyRepository extends JpaRepository<Penalty, Long>{

	List<Penalty> findByBookingId(Long bookingId);

	
}
