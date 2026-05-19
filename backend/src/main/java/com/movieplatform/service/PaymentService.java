// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.service;

import org.springframework.stereotype.Service;

@Service
public class PaymentService {
    public boolean processPayment(String userId, double amount, String paymentMethod) {
        // Mock implementation for Stripe/PayPal
        System.out.println("Processing " + paymentMethod + " payment of LKR " + amount + " for user " + userId);
        return true; // Assume success
    }
}
