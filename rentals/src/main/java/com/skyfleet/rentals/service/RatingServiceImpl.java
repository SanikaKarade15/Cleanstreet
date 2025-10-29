package com.skyfleet.rentals.service;

import com.skyfleet.rentals.custom_exceptions.ApiException;
import com.skyfleet.rentals.dto.RatingRequestDTO;
import com.skyfleet.rentals.dto.RatingResponseDTO;
import com.skyfleet.rentals.entity.Booking;
import com.skyfleet.rentals.entity.Drone;
import com.skyfleet.rentals.entity.Rating;
import com.skyfleet.rentals.entity.RatingValue;
import com.skyfleet.rentals.entity.User;
import com.skyfleet.rentals.repository.BookingRepository;
import com.skyfleet.rentals.repository.DroneRepository;
import com.skyfleet.rentals.repository.RatingRepository;
import com.skyfleet.rentals.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@AllArgsConstructor
public class RatingServiceImpl implements RatingService {
    private RatingRepository ratingRepository;
    private DroneRepository droneRepository;
    private BookingRepository bookingRepository;
    private UserRepository userRepository;
    private ModelMapper modelMapper;

    @Override
    public RatingResponseDTO saveRating(RatingRequestDTO ratingRequest) {
        Rating entity = modelMapper.map(ratingRequest, Rating.class);
        // Fetch related entities
        Drone drone = droneRepository.findById(ratingRequest.getDroneId())
            .orElseThrow(() -> new ApiException("Drone_id not found"));
        User user = userRepository.findById(ratingRequest.getUserId())
            .orElseThrow(() -> new ApiException("user_id not found"));
        Booking booking = bookingRepository.findById(ratingRequest.getBookingId())
            .orElseThrow(() -> new ApiException("booking_id not found"));
        entity.setBooking(booking);
        entity.setUser(user);
        entity.setDrone(drone);
        ratingRepository.save(entity);
        RatingResponseDTO response = modelMapper.map(entity, RatingResponseDTO.class);
        response.setUserName(user.getName());
        response.setDroneModel(drone.getModel());
        return response;
    }

    @Override
    public List<RatingResponseDTO> getAllRatings() {
        return ratingRepository.findAll().stream().map(entity -> {
            RatingResponseDTO response = modelMapper.map(entity, RatingResponseDTO.class);
            response.setUserName(entity.getUser().getName());
            response.setDroneModel(entity.getDrone().getModel());
            return response;
        }).toList();
    }

    @Override
    public RatingResponseDTO getRatingById(Long id) {
        Rating entity = ratingRepository.findById(id).orElseThrow(() -> new ApiException("Rating_id not Found"));
        RatingResponseDTO response = modelMapper.map(entity, RatingResponseDTO.class);
        response.setUserName(entity.getUser().getName());
        response.setDroneModel(entity.getDrone().getModel());
        return response;
    }

    @Override
    public List<RatingResponseDTO> getRatingsByBookingId(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new ApiException("Booking with ID " + bookingId + " not found");
        }
        List<Rating> ratings = ratingRepository.findByBookingId(bookingId);
        return ratings.stream().map(rating -> {
            RatingResponseDTO response = modelMapper.map(rating, RatingResponseDTO.class);
            response.setUserName(rating.getUser().getName());
            response.setDroneModel(rating.getDrone().getModel());
            return response;
        }).toList();
    }

    @Override
    public void deleteRating(Long id) {
        ratingRepository.deleteById(id);
    }
}