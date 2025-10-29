package com.skyfleet.rentals.service;

import com.skyfleet.rentals.custom_exceptions.ApiException;
import com.skyfleet.rentals.dto.UndertakingRequestDTO;
import com.skyfleet.rentals.dto.UndertakingResponseDTO;
import com.skyfleet.rentals.entity.Undertaking;
import com.skyfleet.rentals.repository.UndertakingRepository;

import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class UndertakingServiceImpl implements UndertakingService {

    
    private UndertakingRepository undertakingRepository;
    
    private ModelMapper modelMapper;

    @Override
    public UndertakingResponseDTO saveUndertaking(UndertakingRequestDTO undertaking) {
    	
    	Undertaking entity= modelMapper.map(undertaking, Undertaking.class);
    	
    	undertakingRepository.save(entity);
    	
    	
        return modelMapper.map(entity, UndertakingResponseDTO.class);
    }

    @Override
    public List<UndertakingResponseDTO> getAllUndertakings() {
    	
    	return undertakingRepository.findAll().stream().filter( e-> e.getUniquetext()).map(e-> modelMapper.map(e, UndertakingResponseDTO.class)).toList();
    	
   
    }

    @Override
    public UndertakingResponseDTO getUndertakingById(Long id) {
    	
    Undertaking entity=	undertakingRepository.findById(id).orElseThrow(()->new ApiException("Undertaking Not Found"));
    	
        return modelMapper.map(entity, UndertakingResponseDTO.class);
    }

    @Override
    public void deleteUndertaking(Long id) {
   
        undertakingRepository.deleteById(id);
    }
    
    
  
    
    
//    public BigDecimal calculateDeposit(BigDecimal perHourPrice) {
//    	  final BigDecimal MIN_DEPOSIT = BigDecimal.valueOf(500);
//   	   final BigDecimal MULTIPLIER = BigDecimal.valueOf(10);
//   	  
//   	  final BigDecimal estimated=   BigDecimal.valueOf(perHourPrice.doubleValue() * MULTIPLIER.doubleValue());
//   	  
//   return	  estimated.max(MIN_DEPOSIT);
//    }
    
    public BigDecimal calculateSecurityDeposit(BigDecimal dronePrice) {
        double price = dronePrice.doubleValue();

        if (price >= 10000 && price <= 100000) {
            // Consumer drones = 10%
            return BigDecimal.valueOf(price * 0.10);
        } else if (price > 100000 && price <= 400000) {
            // Professional drones = 15%
            return BigDecimal.valueOf(price * 0.15);
        } else if (price > 400000) {
            // Enterprise drones = 25%
            return BigDecimal.valueOf(price * 0.25);
        } else {
            // Below ₹10,000 = 5% deposit
            return BigDecimal.valueOf(price * 0.05);
        }
    }


    
    
}