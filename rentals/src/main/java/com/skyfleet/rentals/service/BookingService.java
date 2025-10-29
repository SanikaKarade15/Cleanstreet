package com.skyfleet.rentals.service;

import com.skyfleet.rentals.dto.BookingRequestDTO;
import com.skyfleet.rentals.dto.BookingResponseDTO;
import com.skyfleet.rentals.dto.MyBookingsDTO;
import com.skyfleet.rentals.entity.Booking;
import java.util.List;

public interface BookingService {
    BookingResponseDTO saveBooking(BookingRequestDTO booking);
    List<BookingResponseDTO> getAllBookings();
    BookingResponseDTO getBookingById(Long id);
    void deleteBooking(Long id);
    void calculateTotalAmount(Booking booking);
    void updateBookingStatus(Long id, String status);
    
    List<MyBookingsDTO> getBookingsByCustomerId(Long id);
    
}