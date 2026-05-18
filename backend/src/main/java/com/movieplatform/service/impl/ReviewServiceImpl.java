// IT25101540 – Gunathilaka H.D.T.T. – Component 03: Review & Rating Management
package com.movieplatform.service.impl;

import com.movieplatform.dto.ReviewDTO;
import com.movieplatform.model.PublicReview;
import com.movieplatform.model.Review;
import com.movieplatform.model.VerifiedRenterReview;
import com.movieplatform.repository.MovieRepository;
import com.movieplatform.repository.RentalRepository;
import com.movieplatform.repository.ReviewRepository;
import com.movieplatform.repository.UserRepository;
import com.movieplatform.service.ReviewService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final RentalRepository rentalRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository,
                             UserRepository userRepository,
                             MovieRepository movieRepository,
                             RentalRepository rentalRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.rentalRepository = rentalRepository;
    }

    @Override
    public ReviewDTO submit(String movieId, String userId, int starRating, String comment) {
        // Check if user has rented the movie to make it a Verified Review
        boolean hasRented = rentalRepository.findByUserId(userId).stream()
                .anyMatch(rental -> rental.getMovieId().equals(movieId));

        Review r;
        if (hasRented) {
            r = new VerifiedRenterReview(null, movieId, userId, starRating, comment, true);
        } else {
            r = new PublicReview(null, movieId, userId, starRating, comment);
        }

        reviewRepository.save(r);
        return toDTO(r);
    }

    @Override
    public List<ReviewDTO> findByMovie(String movieId) {
        return reviewRepository.findByMovieId(movieId).stream()
                .filter(r -> !r.isHidden()).map(this::toDTO).toList();
    }

    @Override
    public List<ReviewDTO> findByUser(String userId) {
        return reviewRepository.findByUserId(userId).stream().map(this::toDTO).toList();
    }

    @Override
    public List<ReviewDTO> findAll() {
        return reviewRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public double getAverageRating(String movieId) {
        List<Review> reviews = reviewRepository.findByMovieId(movieId).stream()
                .filter(r -> !r.isHidden()).toList();
        if (reviews.isEmpty()) return 0.0;
        return reviews.stream().mapToInt(Review::getStarRating).average().orElse(0.0);
    }

    @Override
    public ReviewDTO update(String id, int starRating, String comment) {
        Review r = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        r.setStarRating(starRating);
        r.setCommentText(comment);
        reviewRepository.save(r);
        return toDTO(r);
    }

    @Override
    public void delete(String id) { reviewRepository.deleteById(id); }

    @Override
    public void hide(String id) {
        Review r = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        r.setHidden(true);
        reviewRepository.save(r);
    }

    @Override
    public void unhide(String id) {
        Review r = reviewRepository.findById(id).orElseThrow(() -> new RuntimeException("Review not found"));
        r.setHidden(false);
        reviewRepository.save(r);
    }

    private ReviewDTO toDTO(Review r) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(r.getId()); dto.setMovieId(r.getMovieId()); dto.setUserId(r.getUserId());
        dto.setStarRating(r.getStarRating()); dto.setCommentText(r.getCommentText());
        dto.setCreatedAt(r.getCreatedAt()); dto.setVerified(r.isVerified()); dto.setHidden(r.isHidden());

        // Resolve username and email from userId
        userRepository.findById(r.getUserId()).ifPresent(u -> {
            dto.setUsername(u.getUsername());
            dto.setUserEmail(u.getEmail());
        });
        if (dto.getUsername() == null) dto.setUsername(r.getUserId());

        // Resolve movie title from movieId
        movieRepository.findById(r.getMovieId()).ifPresent(m -> {
            dto.setMovieTitle(m.getTitle());
        });
        if (dto.getMovieTitle() == null) dto.setMovieTitle("Unknown Movie (" + r.getMovieId() + ")");

        return dto;
    }
}
