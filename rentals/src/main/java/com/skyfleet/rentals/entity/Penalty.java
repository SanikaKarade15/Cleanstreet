package com.skyfleet.rentals.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Entity
@Table(name = "penalties")
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
public class Penalty extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    @JsonIgnore
    private Booking booking;

    
    @Enumerated(EnumType.STRING)
    @Column(name = "penalty_reason", nullable = false)
    private PenaltyReasonStatus penaltyReason;

    @Column(name = "penalty_amount", nullable = false)
    private BigDecimal penaltyAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "penalty_status", nullable = false)
    private PenaltyStatus penaltyStatus; // Enum for penalty status
}