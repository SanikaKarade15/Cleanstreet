package com.skyfleet.rentals.service;

import com.skyfleet.rentals.custom_exceptions.ApiException;
import com.skyfleet.rentals.dto.BookingRequestDTO;
import com.skyfleet.rentals.dto.BookingResponseDTO;
import com.skyfleet.rentals.dto.MyBookingsDTO;
import com.skyfleet.rentals.entity.Booking;

import com.skyfleet.rentals.entity.BookingStatus;
import com.skyfleet.rentals.entity.DeliveryStatus;
import com.skyfleet.rentals.entity.Drone;
import com.skyfleet.rentals.entity.DroneStatus;
import com.skyfleet.rentals.entity.Payment;
import com.skyfleet.rentals.entity.Undertaking;
import com.skyfleet.rentals.entity.User;
import com.skyfleet.rentals.repository.BookingRepository;
import com.skyfleet.rentals.repository.DroneRepository;
import com.skyfleet.rentals.repository.PaymentRepository;
import com.skyfleet.rentals.repository.UndertakingRepository;
import com.skyfleet.rentals.repository.UserRepository;

import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class BookingServiceImpl implements BookingService {

    
    private BookingRepository bookingRepository;
    
    private UserRepository userRepository;
    
    
    private DroneRepository droneRepository;
    
    private UndertakingRepository undertakingRespository;
    
    private PaymentRepository paymentRepository;
    
    private ModelMapper modelMapper;
    
    private UndertakingServiceImpl undertakingServiceImpl;

    @Override
    public BookingResponseDTO saveBooking(BookingRequestDTO booking) {
    	
    	User user =userRepository.findById(booking.getUserId()).orElseThrow(()->new ApiException("No Such User..!"));
    	Drone drone= droneRepository.findById(booking.getDroneId()).orElseThrow(()->new ApiException("No Such Drone Found..!"));
    	
    	List<Undertaking> undertakingList=  undertakingRespository.findDistinctByDamageClauseText();
    
    	List<Undertaking> newUndertaking=new ArrayList<Undertaking>();
    	Booking book=new Booking();
    	
    	
    	if(booking.isUndertakingIsAccepted())
    	{
    		
    		user.setAddress(booking.getAddress());
    		book.setUser(user);
    		book.setDrone(drone);
    		book.setDeliveryDateTime(LocalDateTime.now().plusDays(3));
    		book.setStartTime(booking.getStartTime());
    		book.setEndTime(booking.getEndTime());
    		 calculateTotalAmount(book);
    		book.setStatus(BookingStatus.CONFIRMED);
    		book.setDeliverStatus(DeliveryStatus.PENDING);	
    		
    		undertakingList.forEach(e->{
				Undertaking newEntity=new Undertaking();
				newEntity.setBooking(book);
				newEntity.setDamageClauseText(e.getDamageClauseText());
				
				
				newEntity.setDepositAmount(undertakingServiceImpl.calculateSecurityDeposit(drone.getDronePrice()));
				book.setTotalAmount( BigDecimal.valueOf(book.getTotalAmount().doubleValue()+newEntity.getDepositAmount().doubleValue()));
				newEntity.setIsAccepted(true);
				newEntity.setUpdatedOn(LocalDateTime.now());
    			newUndertaking.add(newEntity);
    			});
    		
    		userRepository.save(user);
    		bookingRepository.save(book);
    		undertakingRespository.saveAll(newUndertaking);	
    		BookingResponseDTO rs=modelMapper.map(book, BookingResponseDTO.class);
    		
    		
    		rs.setUserId(user.getId());
    		rs.setDroneId(drone.getId());
    		return rs;
    	}else {
    		throw new ApiException("Undertaking Not Accepted..!");
    	} 
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
    	
                 List<Booking> entities =bookingRepository.findAll();
                  
                 
    	
        return entities.stream().map(e->{ 
        	
        	BookingResponseDTO rs= modelMapper.map(e, BookingResponseDTO.class);
        	rs.setUserId(e.getUser().getId());
    		rs.setDroneId(e.getDrone().getId());
    		
        return rs;
        }).toList();
    }

    @Override
    public BookingResponseDTO getBookingById(Long id) {
    	
    	Booking entity= bookingRepository.findById(id).orElseThrow(()-> new ApiException("Booking_id not Found..!"));
    	
       BookingResponseDTO rs=  modelMapper.map(entity, BookingResponseDTO.class) ;
       
       rs.setUserId(entity.getUser().getId());
       rs.setDroneId(entity.getDrone().getId());
       return rs;
    }
    
    
    
    
    @Override
    public List<MyBookingsDTO> getBookingsByCustomerId(Long id) throws RuntimeException {
    		
    	
    	if(id==null)
    		throw new ApiException("User Id Cannot Be Null");
//    	User user= userRepository.findById(id).orElseThrow(()-> new ApiException("user Not Found"));
    	List<MyBookingsDTO> entities= bookingRepository.getBookingsByCustomerId(id).stream().map((entity)->{
    		MyBookingsDTO m= modelMapper.map(entity, MyBookingsDTO.class);
    		return m;
    	}).toList();
    	
    	
    	return entities;
//    	List<Undertaking> undertakingList= entities.stream().map((entity)->{
//    		Undertaking u= undertakingRespository.findByBookingId(entity.getId());
//    		return u;
//    	}).toList();
//    	
//    	List<Payment> payments = entities.stream().map((entity)->{
//    		Payment payment= paymentRepository.getById(id)
//    	}).toList();
    	
    	
      
    }

    @Override
    public void deleteBooking(Long id) {
    	if(bookingRepository.existsById(id))
    		bookingRepository.deleteById(id);
    	else
    		throw new ApiException("Booking_id not Found ..!");
        
    }

    @Override
    public void calculateTotalAmount(Booking booking) {
        Drone drone = booking.getDrone();
        Duration duration = Duration.between(booking.getStartTime(), booking.getEndTime());

        BigDecimal total= BigDecimal.valueOf( Math.ceil(duration.toMinutes()/60.0)*drone.getPricePerHour().doubleValue() );
        booking.setTotalAmount(total);
        
    }

    @Override
    public void updateBookingStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ApiException("Booking not found"));
        
        try {
            BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
            booking.setStatus(bookingStatus);
            bookingRepository.save(booking);
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid booking status: " + status);
        }
    }
}