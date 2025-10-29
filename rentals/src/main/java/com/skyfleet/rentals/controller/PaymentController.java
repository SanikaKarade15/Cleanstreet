package com.skyfleet.rentals.controller;

import com.skyfleet.rentals.dto.PaymentRequestDTO;
import com.skyfleet.rentals.dto.PaymentResponseDTO;
import com.skyfleet.rentals.dto.RazorpayPaymentResponseDTO;
import com.skyfleet.rentals.entity.Payment;
import com.skyfleet.rentals.service.PaymentService;

import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@AllArgsConstructor
public class PaymentController {

    
    private PaymentService paymentService;
    
   

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> createPayment(@RequestBody PaymentRequestDTO payment) {
        return ResponseEntity.ok(paymentService.savePayment(payment));
    }

    @GetMapping("/all/payments")
    public ResponseEntity<List<PaymentResponseDTO>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponseDTO> getPaymentById(@PathVariable Long id) {
      
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
    
    
    
    @PostMapping("/verifyPayment")
    public ResponseEntity<PaymentResponseDTO> verifyPayment(@RequestBody RazorpayPaymentResponseDTO response ){

    return ResponseEntity.ok(paymentService.verifyPayment(response));
    	
    	
    }
}