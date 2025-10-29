package com.skyfleet.rentals.service;

import com.fasterxml.jackson.databind.ObjectMapper;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.skyfleet.rentals.custom_exceptions.ApiException;
import com.skyfleet.rentals.dto.BookingResponseDTO;
import com.skyfleet.rentals.dto.DroneResponseDTO;
import com.skyfleet.rentals.dto.PaymentRequestDTO;
import com.skyfleet.rentals.dto.PaymentResponseDTO;
import com.skyfleet.rentals.dto.RatingResponseDTO;
import com.skyfleet.rentals.dto.RazorpayPaymentResponseDTO;
import com.skyfleet.rentals.dto.UserResponseDTO;
import com.skyfleet.rentals.entity.Booking;
import com.skyfleet.rentals.entity.BookingStatus;
import com.skyfleet.rentals.entity.Payment;
import com.skyfleet.rentals.entity.PaymentStatus;
import com.skyfleet.rentals.entity.RazorpayOrderResponse;
import com.skyfleet.rentals.repository.BookingRepository;
import com.skyfleet.rentals.repository.PaymentRepository;
import com.skyfleet.rentals.repository.UserRepository;

import io.swagger.v3.oas.models.responses.ApiResponse;
import lombok.AllArgsConstructor;

import org.apache.commons.codec.binary.Hex;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
@Transactional
public class PaymentServiceImpl implements PaymentService {


  

	private PaymentRepository paymentRepository;
    
    private UserRepository userRepository;
    
    private BookingRepository bookingRepository;
    
    private ModelMapper modelMapper;
    
    
    
    @Value("${razorpay.api.key}")
    private   String apiKey;

    @Value("${razorpay.api.secret}")
    private  String apiSecret;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository, UserRepository userRepository,
			BookingRepository bookingRepository, ModelMapper modelMapper) {
		super();
		this.paymentRepository = paymentRepository;
		this.userRepository = userRepository;
		this.bookingRepository = bookingRepository;
		this.modelMapper = modelMapper;
	}
    
    
    
    
    
 
    

    @Override
    public PaymentResponseDTO savePayment(PaymentRequestDTO payment){
//    	if (payment.getPaymentStatus() == null) {
//            payment.setPaymentStatus(PaymentStatus.PENDING);
//        }
//        return paymentRepository.save(payment);
    	
    	
    	
    	if(bookingRepository.existsById(payment.getBookingId())) {
    		try {
    			RazorpayClient razorpayClient= new RazorpayClient(apiKey,apiSecret);
        		
        		JSONObject 	orderRequest= new JSONObject();
        		
        		orderRequest.put("amount", payment.getAmountPaid().doubleValue()*100);
        		orderRequest.put("currency", "INR");
        		orderRequest.put("receipt", payment.getBookingId().toString());
        		
        		Order order=razorpayClient.orders.create(orderRequest);
        		
        		
        		
        	
        		ObjectMapper objectMapper = new ObjectMapper();
        		
        		RazorpayOrderResponse razorpayOrder = objectMapper.readValue(order.toString(), RazorpayOrderResponse.class);
        		
        		//System.out.println(razorpayOrder.getId());
        		
        		
        		
        		Payment entity= new Payment();
        		
        		Booking booking= bookingRepository.getReferenceById(payment.getBookingId());
        		
        		
        		entity.setBooking(booking);
        		entity.setAmountPaid(BigDecimal.valueOf(payment.getAmountPaid().doubleValue()));
        		entity.setPaymentStatus(PaymentStatus.PENDING);
        		entity.setRazorpayPaymentId(razorpayOrder.getReceipt());
        		entity.setRazorpayOrderId(razorpayOrder.getId());
        		entity.setPaymentMethod("Not Known");
        		
        		paymentRepository.save(entity);
        		
        		
        		return modelMapper.map(entity, PaymentResponseDTO.class);
        		
    		}catch (Exception e) {
				// TODO: handle exception
    			throw new ApiException(e.getMessage());
			}
    	}else {
    		throw new ApiException("booking_id Not Found");
    	}
    	
    	
    }
    
    
    public PaymentResponseDTO verifyPayment( RazorpayPaymentResponseDTO response) {
        try {
        	System.out.println("inside the try block");
        	System.out.println(response.toString());
           
            if(isSignatureValid(response.getRazorpayOrderId(),response.getRazorpayPaymentId(),response.getRazorpaySignature()))
             {
                // Signature is valid → Update DB
                Payment payment = paymentRepository.findByRazorpayOrderId(response.getRazorpayOrderId());
              Booking booking= bookingRepository.findById(payment.getBooking().getId()).orElseThrow(()->new ApiException("Booking Id not Found For doing Payment"));
                if (payment != null) {
                	payment.setRazorpayPaymentId(response.getRazorpayPaymentId());
                	payment.setRazorpaySignature(response.getRazorpaySignature());
                	payment.setPaymentStatus(PaymentStatus.COMPLETED);
                	booking.setStatus(BookingStatus.COMPLETED);
                	payment.setPaymentMethod("UPI");
                    paymentRepository.save(payment);
                    bookingRepository.save(booking);
                }
                return modelMapper.map(payment, PaymentResponseDTO.class);
            } else {
               throw new ApiException("Payment Failed");
            }
        } catch (Exception e) {
            throw new ApiException("Payment Error:"+e);
        }
    }
    
    
    
    

    @Override
    public List<PaymentResponseDTO> getAllPayments() {
        return paymentRepository.findAll().stream().map((entity) -> {
            // Map basic payment data
            PaymentResponseDTO rs = modelMapper.map(entity, PaymentResponseDTO.class);
            rs.setBookingId(entity.getBooking().getId());
            
            // ✅ Create nested BookingResponseDTO
            BookingResponseDTO bookingDto = modelMapper.map(entity.getBooking(), BookingResponseDTO.class);
            bookingDto.setUserId(entity.getBooking().getUser().getId());
            bookingDto.setDroneId(entity.getBooking().getDrone().getId());
            
            // ✅ Create nested UserResponseDTO
            UserResponseDTO userDto = modelMapper.map(entity.getBooking().getUser(), UserResponseDTO.class);
            userDto.setId(entity.getBooking().getUser().getId());
            bookingDto.setUser(userDto);
            
            // ✅ Create nested DroneResponseDTO
            DroneResponseDTO droneDto = modelMapper.map(entity.getBooking().getDrone(), DroneResponseDTO.class);
            droneDto.setId(entity.getBooking().getDrone().getId());
            bookingDto.setDrone(droneDto);
            
            // ✅ Set the nested booking data
            rs.setBooking(bookingDto);
            
            return rs;
        }).toList();
    }


    @Override
    public PaymentResponseDTO getPaymentById(Long id) {
        Payment entity = paymentRepository.findById(id)
            .orElseThrow(() -> new ApiException("Payment_id not Found"));
        
        PaymentResponseDTO rs = modelMapper.map(entity, PaymentResponseDTO.class);
        rs.setBookingId(entity.getBooking().getId());
        
        // ✅ Add the same nested structure as getAllPayments()
        BookingResponseDTO bookingDto = modelMapper.map(entity.getBooking(), BookingResponseDTO.class);
        bookingDto.setUserId(entity.getBooking().getUser().getId());
        bookingDto.setDroneId(entity.getBooking().getDrone().getId());
        
        UserResponseDTO userDto = modelMapper.map(entity.getBooking().getUser(), UserResponseDTO.class);
        userDto.setId(entity.getBooking().getUser().getId());
        bookingDto.setUser(userDto);
        
        DroneResponseDTO droneDto = modelMapper.map(entity.getBooking().getDrone(), DroneResponseDTO.class);
        droneDto.setId(entity.getBooking().getDrone().getId());
        bookingDto.setDrone(droneDto);
        
        rs.setBooking(bookingDto);
        
        return rs;
    }

    @Override
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
       
    }
    
    
    public String generateSignature(String orderId, String paymentId, String secret) {
        try {
            String payload = orderId + "|" + paymentId;

            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(), "HmacSHA256"));

            byte[] digest = mac.doFinal(payload.getBytes());

            // Razorpay uses hex encoding
            return Hex.encodeHexString(digest);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Razorpay signature", e);
        }
    }
    
    public  boolean isSignatureValid(String orderId, String paymentId, String signatureFromRazorpay) {
        String generatedSignature = generateSignature(orderId, paymentId, apiSecret);
        return generatedSignature.equals(signatureFromRazorpay);
    }
    
    
}