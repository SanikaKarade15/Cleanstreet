package com.skyfleet.rentals.service;

import com.razorpay.RazorpayException;
import com.skyfleet.rentals.dto.PaymentRequestDTO;
import com.skyfleet.rentals.dto.PaymentResponseDTO;
import com.skyfleet.rentals.dto.RazorpayPaymentResponseDTO;
import com.skyfleet.rentals.entity.Payment;
import java.util.List;

public interface PaymentService {
    PaymentResponseDTO savePayment(PaymentRequestDTO payment) ;
    List<PaymentResponseDTO> getAllPayments();
    PaymentResponseDTO getPaymentById(Long id);
    void deletePayment(Long id);
    
    PaymentResponseDTO verifyPayment( RazorpayPaymentResponseDTO response);
}