package com.skyfleet.rentals.service;

import com.skyfleet.rentals.custom_exceptions.ApiException;
import com.skyfleet.rentals.dto.PenaltyRequestDTO;
import com.skyfleet.rentals.dto.PenaltyResponseDTO;
import com.skyfleet.rentals.entity.Booking;
import com.skyfleet.rentals.entity.Drone;
import com.skyfleet.rentals.entity.Penalty;
import com.skyfleet.rentals.entity.PenaltyReasonStatus;
import com.skyfleet.rentals.entity.PenaltyStatus;
import com.skyfleet.rentals.repository.BookingRepository;
import com.skyfleet.rentals.repository.PenaltyRepository;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PenaltyServiceImpl implements PenaltyService {

	private PenaltyRepository penaltyRepository;
    
    private ModelMapper modelMapper;
    
    
    private BookingRepository bookingRepository;
    
    
    private static final double LATE_FEE_RATE = 1.5; // 1.5x hourly rate
    private static final double DAMAGE_FIXED_AMOUNT = 300.0; // 50 for damage
    private static final double CANCELLATION_FEE_RATE = 0.2;// 20% of total amount
    
    
    
    @Autowired
    public PenaltyServiceImpl(PenaltyRepository penaltyRepository, ModelMapper modelMapper,
			BookingRepository bookingRepository) {
		super();
		this.penaltyRepository = penaltyRepository;
		this.modelMapper = modelMapper;
		this.bookingRepository = bookingRepository;
	}

    @Override
    public PenaltyResponseDTO savePenalty(PenaltyRequestDTO penalty) {

    	
    	if(bookingRepository.existsById(penalty.getBookingId())) {
    		
    		Booking booking= bookingRepository.getReferenceById(penalty.getBookingId());
    		
    		Penalty entity= calculatePenalty(booking, penalty.getPenaltyReason());
    		
    		 PenaltyResponseDTO rs= modelMapper.map(entity, PenaltyResponseDTO.class);
    		 
    		 rs.setBookingId(entity.getBooking().getId());
    		 
    		 return rs;
    	}
    	
    	
    	
    	return null;
    }

    @Override
    public List<PenaltyResponseDTO> getPenaltiesByBookingId(Long bookingId) {
        System.out.println("🔍 Fetching penalties for booking ID: " + bookingId);
        
        // Validate that the booking exists
        if (!bookingRepository.existsById(bookingId)) {
            throw new ApiException("Booking with ID " + bookingId + " not found");
        }
        
        // Fetch penalties for the booking
        List<Penalty> penalties = penaltyRepository.findByBookingId(bookingId);
        
        System.out.println("📋 Found " + penalties.size() + " penalties for booking " + bookingId);
        
        // Convert to DTOs
        return penalties.stream().map(penalty -> {
            PenaltyResponseDTO dto = modelMapper.map(penalty, PenaltyResponseDTO.class);
            dto.setBookingId(penalty.getBooking().getId());
            return dto;
        }).toList();
    }
    @Override
    public List<PenaltyResponseDTO> getAllPenalties() {
        return penaltyRepository.findAll().stream().map(e->{
        	PenaltyResponseDTO rs= modelMapper.map(e, PenaltyResponseDTO.class);
        	return rs;
        }).toList();
    }

    @Override
    public PenaltyResponseDTO getPenaltyById(Long id) {
        Penalty entity= penaltyRepository.findById(id).orElseThrow(()->new ApiException("Penalty_id not Found"));
        
        return modelMapper.map(entity, PenaltyResponseDTO.class);
    }

    @Override
    public void deletePenalty(Long id) {
        penaltyRepository.deleteById(id);
    }
    
    
    @Override
    public Penalty calculatePenalty(Booking booking, PenaltyReasonStatus penaltyReason) {
        Penalty penalty = new Penalty();
        penalty.setBooking(booking);
        penalty.setPenaltyReason(penaltyReason);
        penalty.setPenaltyStatus(PenaltyStatus.PENDING);

        Drone drone = booking.getDrone();
        LocalDateTime endTime = booking.getEndTime();
        LocalDateTime currentTime = LocalDateTime.now();

        if (penaltyReason == null || booking == null || drone == null || endTime == null) {
            throw new ApiException("Booking, Drone, EndTime, or PenaltyReason is null");
        }

        BigDecimal penaltyAmount = BigDecimal.valueOf(0.0);

        switch (penaltyReason) {
            case LATE_RETURN:
                if (currentTime.isAfter(endTime)) {
                    Duration delay = Duration.between(endTime, currentTime);
                    long hoursDelayed = (long) Math.ceil((double) delay.toMinutes() / 60);
                    if (hoursDelayed > 0) {
                        penaltyAmount = BigDecimal.valueOf(hoursDelayed * drone.getPricePerHour().doubleValue() * LATE_FEE_RATE);
                    }
                }
                break;

            case DAMAGE:
                penaltyAmount = BigDecimal.valueOf(DAMAGE_FIXED_AMOUNT);
                break;

            case CANCELLATION:
                BigDecimal totalAmount = booking.getTotalAmount();
                double temp =  totalAmount.doubleValue() * CANCELLATION_FEE_RATE;
                penaltyAmount = BigDecimal.valueOf(temp);
                break;

            default:
                break;
        }

        if (penaltyAmount.intValue() > 0) {
            penalty.setPenaltyAmount(penaltyAmount);
            return penaltyRepository.save(penalty);
        } else {
        	throw new ApiException("No penalty applicable for this booking");// No penalty, no need to save
        }
    }

    
    
}