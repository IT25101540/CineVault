// IT25101540 – Gunathilaka H.D.T.T. – Component 03: Review & Rating Management
package com.movieplatform.service;

import com.movieplatform.dto.ReviewDTO;
import java.util.List;
import java.util.Optional;

public interface ReviewService {
    ReviewDTO submit(String movieId, String userId, int starRating, String comment);
    List<ReviewDTO> findByMovie(String movieId);
    List<ReviewDTO> findByUser(String userId);
    List<ReviewDTO> findAll();
    double getAverageRating(String movieId);
    ReviewDTO update(String id, int starRating, String comment);
    void delete(String id);
    void hide(String id);
    void unhide(String id);
}
