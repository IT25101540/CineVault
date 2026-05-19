// IT25101901 – Thanuluxshan K. – Component 03: Review & Rating Management
package com.movieplatform.dto;

import java.time.LocalDateTime;

public class ReviewDTO {
    private String id;
    private String movieId;
    private String userId;
    private String username;   // resolved from userId
    private String userEmail;  // resolved from userId
    private String movieTitle; // resolved from movieId
    private int starRating;
    private String commentText;
    private LocalDateTime createdAt;
    private boolean verified;
    private boolean hidden;

    public ReviewDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }
    public int getStarRating() { return starRating; }
    public void setStarRating(int starRating) { this.starRating = starRating; }
    public String getCommentText() { return commentText; }
    public void setCommentText(String commentText) { this.commentText = commentText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
    public boolean isHidden() { return hidden; }
    public void setHidden(boolean hidden) { this.hidden = hidden; }

    @Override public String toString() { return "ReviewDTO{id='" + id + "', movieId='" + movieId + "'}"; }
}
