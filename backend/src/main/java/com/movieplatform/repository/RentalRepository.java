// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.repository;

import com.movieplatform.model.RentalTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * RentalRepository – MongoDB persistence.
 */
@Repository
public interface RentalRepository extends MongoRepository<RentalTransaction, String> {
    
    List<RentalTransaction> findByUserId(String userId);
}
