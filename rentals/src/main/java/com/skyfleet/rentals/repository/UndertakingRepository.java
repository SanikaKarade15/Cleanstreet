package com.skyfleet.rentals.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.skyfleet.rentals.entity.Undertaking;


public interface UndertakingRepository  extends JpaRepository<Undertaking, Long>{
	
	@Query(value = """
		    SELECT u.* FROM undertakings u
		    INNER JOIN (
		        SELECT MIN(id) as id
		        FROM undertakings
		        GROUP BY damage_clause_text
		    ) grouped ON u.id = grouped.id
		""", nativeQuery = true)
		List<Undertaking> findDistinctByDamageClauseText();
	
	
	
		Undertaking findByBookingId(Long bookingId);
		



}
