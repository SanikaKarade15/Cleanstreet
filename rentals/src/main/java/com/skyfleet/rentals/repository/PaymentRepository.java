package com.skyfleet.rentals.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skyfleet.rentals.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long>{

	
	Payment findByRazorpayOrderId(String orderId);
}
