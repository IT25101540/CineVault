// IT25101901 – Thanuluxshan K. – Component 03: Review & Rating Management
package com.movieplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Review – base entity. starRating validated in setter (Encapsulation).
 */
@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String movieId;
    private String userId;
    private int starRating;   // 1–5
    private String commentText;
    private LocalDateTime createdAt;
    private boolean isVerified;
    private boolean isHidden;
    private String status; // PENDING, APPROVED, REJECTED

    public Review() {}

    public Review(String id, String movieId, String userId, int starRating, String commentText) {
        this.id = id;
        this.movieId = movieId;
        this.userId = userId;
        setStarRating(starRating);   // use validated setter
        this.commentText = commentText;
        this.createdAt = LocalDateTime.now();
        this.isVerified = false;
        this.isHidden = false;
        this.status = "PENDING";
    }

    /** Polymorphism hook */
    public String renderBadge() { return ""; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    /** Encapsulation: validate range */
    public int getStarRating() { return starRating; }
    public void setStarRating(int starRating) {
        if (starRating < 1 || starRating > 5)
            throw new IllegalArgumentException("Star rating must be between 1 and 5");
        this.starRating = starRating;
    }

    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }
    public boolean isHidden() { return isHidden; }
    public void setHidden(boolean hidden) { isHidden = hidden; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override public String toString() {
        return "Review{id='" + id + "', movieId='" + movieId + "', stars=" + starRating + "}";
    }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Review r)) return false;
        return Objects.equals(id, r.id);
    }
    @Override public int hashCode() { return Objects.hash(id); }
}
