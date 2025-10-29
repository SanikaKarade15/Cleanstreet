package com.skyfleet.rentals.repository;

import com.skyfleet.rentals.entity.Booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.*;

public interface BookingRepository extends JpaRepository<Booking, Long> {
	
	@Query("select b from Booking b where b.user.id= :id")
	List<Booking> getBookingsByCustomerId(Long id);
	
	
}