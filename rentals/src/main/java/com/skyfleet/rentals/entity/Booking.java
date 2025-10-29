package com.skyfleet.rentals.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
public class Booking  extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    

    @ManyToOne
    @JoinColumn(name = "drone_id", nullable = false)
    private Drone drone;
    
    @CreationTimestamp
    private LocalDateTime bookingDateTime;
    
 // the datetime at which order was actually delivered(i.e status is updated)
 	private LocalDateTime deliveryDateTime;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status; // Enum for booking status
    
   @Enumerated(EnumType.STRING)
   @Column(name="deliverd_status")
    private DeliveryStatus deliverStatus;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Payment> payments;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Penalty> penalties;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Undertaking> undertakings;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
    private List<Rating> ratings;
}