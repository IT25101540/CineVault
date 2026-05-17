// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.service;

import com.movieplatform.dto.RentalDTO;
import java.util.List;
import java.util.Optional;

public interface RentalService {
    RentalDTO rentMovie(String userId, String movieId);
    List<RentalDTO> findByUser(String userId);
    List<RentalDTO> findAll();
    Optional<RentalDTO> findById(String id);
    RentalDTO returnMovie(String rentalId);
    void delete(String id);
}
