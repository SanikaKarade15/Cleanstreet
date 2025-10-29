package com.skyfleet.rentals.service;

import com.skyfleet.rentals.dto.UndertakingRequestDTO;
import com.skyfleet.rentals.dto.UndertakingResponseDTO;
import com.skyfleet.rentals.entity.Undertaking;
import java.util.List;

public interface UndertakingService {
    UndertakingResponseDTO saveUndertaking(UndertakingRequestDTO undertaking);
    List<UndertakingResponseDTO> getAllUndertakings();
    UndertakingResponseDTO getUndertakingById(Long id);
    void deleteUndertaking(Long id);
}