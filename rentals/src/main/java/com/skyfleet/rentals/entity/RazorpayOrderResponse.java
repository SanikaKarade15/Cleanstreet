package com.skyfleet.rentals.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class RazorpayOrderResponse {
    private String id;
    private String entity;
    private int amount_due;
    private String currency;
    private String receipt;
    private String status;
    private int attempts;
    private long created_at;
    private String offer_id;
    private int amount; 
}
