package com.skyfleet.rentals.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "drones")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"bookings","userDrone"},callSuper = true)
public class Drone  extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "model", nullable = false)
    private String model;

    @Column(name = "brand", nullable = false)
    private String brand;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DroneStatus status; // Enum for drone status

    @Column(name = "price_per_hour", nullable = false)
    private BigDecimal pricePerHour;

    @Column(name = "battery_life", nullable = false)
    private Integer batteryLife;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Column(name = "guide_url", nullable = false)
    private String guideUrl;
    
    @Column(name = "drone_price", nullable = false)
    private BigDecimal dronePrice;

    @OneToMany(mappedBy = "drone", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Booking> bookings;
    
    
    @OneToMany(mappedBy="drone",cascade=CascadeType.ALL ,orphanRemoval = true)
    private List<UserDrone> userDrone;
    
    
}