// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.service;

import org.springframework.stereotype.Service;

@Service
public class EmailNotificationService {
    public void sendInvoice(String email, String rentalId, double amount) {
        // Mock email sending
        System.out.println("Sending Invoice/Receipt for rental " + rentalId + " to " + email + ". Amount: LKR " + amount);
    }
}
