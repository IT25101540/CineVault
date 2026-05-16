// IT25101540 – Gunathilaka H.D.T.T. – Component 03: Review & Rating Management
package com.movieplatform.repository;

import com.movieplatform.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * ReviewRepository – MongoDB persistence.
 */
@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    
    List<Review> findByMovieId(String movieId);

    List<Review> findByUserId(String userId);
}
