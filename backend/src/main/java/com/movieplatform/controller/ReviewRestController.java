// IT25101540 – Gunathilaka H.D.T.T. – Component 03: Review & Rating (SOA REST)
package com.movieplatform.controller;

import com.movieplatform.dto.ReviewDTO;
import com.movieplatform.exception.ResourceNotFoundException;
import com.movieplatform.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ReviewRestController – RESTful JSON API for reviews and ratings.
 * Base URL: /api/reviews
 */
@RestController
@RequestMapping("/api/reviews")
public class ReviewRestController {

    private final ReviewService reviewService;

    public ReviewRestController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /** GET /api/reviews – All reviews (admin) */
    @GetMapping
    public ResponseEntity<List<ReviewDTO>> findAll() {
        return ResponseEntity.ok(reviewService.findAll());
    }

    /** GET /api/reviews/movie/{movieId} – Reviews for a specific movie */
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Map<String, Object>> findByMovie(@PathVariable String movieId) {
        List<ReviewDTO> reviews = reviewService.findByMovie(movieId);
        double avg = reviewService.getAverageRating(movieId);
        return ResponseEntity.ok(Map.of(
                "reviews", reviews,
                "averageRating", avg,
                "count", reviews.size()
        ));
    }

    /** GET /api/reviews/user/{userId} – Reviews written by a user */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewDTO>> findByUser(@PathVariable String userId) {
        return ResponseEntity.ok(reviewService.findByUser(userId));
    }

    /** POST /api/reviews – Submit a new review */
    @PostMapping
    public ResponseEntity<ReviewDTO> submit(@RequestBody Map<String, Object> body) {
        ReviewDTO dto = reviewService.submit(
                (String) body.get("movieId"),
                (String) body.get("userId"),
                Integer.parseInt(body.get("starRating").toString()),
                (String) body.get("commentText")
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /** PUT /api/reviews/{id} – Edit review (author only) */
    @PutMapping("/{id}")
    public ResponseEntity<ReviewDTO> update(@PathVariable String id,
                                             @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(reviewService.update(
                id,
                Integer.parseInt(body.get("starRating").toString()),
                (String) body.get("commentText")
        ));
    }

    /** DELETE /api/reviews/{id} – Delete review (author or admin) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        reviewService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Review deleted successfully"));
    }

    /** POST /api/reviews/{id}/hide – Hide review (admin) */
    @PostMapping("/{id}/hide")
    public ResponseEntity<Map<String, String>> hide(@PathVariable String id) {
        reviewService.hide(id);
        return ResponseEntity.ok(Map.of("message", "Review hidden successfully"));
    }

    /** POST /api/reviews/{id}/unhide – Unhide review (admin) */
    @PostMapping("/{id}/unhide")
    public ResponseEntity<Map<String, String>> unhide(@PathVariable String id) {
        reviewService.unhide(id);
        return ResponseEntity.ok(Map.of("message", "Review unhidden successfully"));
    }
}
