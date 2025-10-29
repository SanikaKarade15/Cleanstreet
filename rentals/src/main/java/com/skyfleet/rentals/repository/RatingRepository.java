package com.skyfleet.rentals.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skyfleet.rentals.entity.Rating;

public interface RatingRepository extends JpaRepository<Rating, Long>{

	List<Rating> findByBookingId(Long bookingId);


}
