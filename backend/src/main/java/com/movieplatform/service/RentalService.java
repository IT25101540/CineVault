// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.service;

import com.movieplatform.dto.RentalDTO;
import java.util.List;
import java.util.Optional;

public interface RentalService {
    RentalDTO rentMovie(String userId, String movieId, String promoCode, String paymentMethod);
    List<RentalDTO> findByUser(String userId);
    List<RentalDTO> findAll();
    Optional<RentalDTO> findById(String id);
    RentalDTO returnMovie(String rentalId);
    RentalDTO update(String id, String status, java.time.LocalDate rentalDate, java.time.LocalDate dueDate, java.time.LocalDate returnedDate, Double totalFee);
    void delete(String id);
}
