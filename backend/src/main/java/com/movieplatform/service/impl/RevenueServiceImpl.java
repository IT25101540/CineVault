// IT25101540 – Gunathilaka H.D.T.T. – Component 05: Admin Management
package com.movieplatform.service.impl;

import com.movieplatform.model.RentalTransaction;
import com.movieplatform.repository.RentalRepository;
import com.movieplatform.service.RevenueService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class RevenueServiceImpl implements RevenueService {
    
    private final RentalRepository rentalRepository;

    public RevenueServiceImpl(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    @Override
    public Map<String, Double> getRevenueStats() {
        List<RentalTransaction> rentals = rentalRepository.findAll();
        double daily = 0.0;
        double monthly = 0.0;
        double total = 0.0;
        
        LocalDate today = LocalDate.now();
        int currentMonth = today.getMonthValue();
        int currentYear = today.getYear();

        for (RentalTransaction r : rentals) {
            if (r.getTotalFee() > 0) {
                total += r.getTotalFee();
                if (r.getRentalDate() != null) {
                    if (r.getRentalDate().equals(today)) {
                        daily += r.getTotalFee();
                    }
                    if (r.getRentalDate().getMonthValue() == currentMonth && r.getRentalDate().getYear() == currentYear) {
                        monthly += r.getTotalFee();
                    }
                }
            }
        }

        return Map.of(
            "dailyRevenue", daily,
            "monthlyRevenue", monthly,
            "totalRevenue", total
        );
    }
}
