package com.skyfleet.rentals.service;

import com.skyfleet.rentals.custom_exceptions.ApiException;
import com.skyfleet.rentals.dto.DroneRequestDTO;
import com.skyfleet.rentals.dto.DroneResponseDTO;
import com.skyfleet.rentals.entity.Drone;
import com.skyfleet.rentals.repository.DroneRepository;

import lombok.AllArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class DroneServiceImpl implements DroneService {

    
    private DroneRepository droneRepository;
    
    
    private ModelMapper modelMapper;

    @Override
    public DroneResponseDTO saveDrone(DroneRequestDTO drone) {
    	
    	if(!droneRepository.existsByModel(drone.getModel())) {
    		Drone entity = modelMapper.map(drone, Drone.class);
    		 droneRepository.save(entity);
    		 return modelMapper.map(entity, DroneResponseDTO.class);
    	}else {
    		throw new ApiException("This model Already Exists");
    	}
    }

    @Override
    public List<DroneResponseDTO> getAllDrones() {
    	return droneRepository.findAll().stream().map(entity-> modelMapper.map(entity, DroneResponseDTO.class)).toList();
    	
    }

    @Override
    public DroneResponseDTO getDroneById(Long id) {
      Drone entity= droneRepository.findById(id).orElseThrow(()-> new ApiException("Drone Not Exists"));
        return modelMapper.map(entity, DroneResponseDTO.class);
    }

    @Override
    public void deleteDrone(Long id) {
    	if(droneRepository.existsById(id))
    		 droneRepository.deleteById(id);
    	else
    		throw new ApiException("Drone Dosen't Exists");
    	
       
    }
}