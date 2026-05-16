// IT25101540 – Gunathilaka H.D.T.T. – Component 03: Review & Rating Management
package com.movieplatform.model;

import org.springframework.data.mongodb.core.mapping.Document;

/** VerifiedRenterReview – user must have completed rental (Inheritance). */
@Document(collection = "reviews")
public class VerifiedRenterReview extends Review {
    private boolean rentVerified;

    public VerifiedRenterReview() { super(); }
    public VerifiedRenterReview(String id, String movieId, String userId,
                                 int starRating, String commentText, boolean rentVerified) {
        super(id, movieId, userId, starRating, commentText);
        this.rentVerified = rentVerified;
        setVerified(rentVerified);
    }

    public boolean isRentVerified() { return rentVerified; }
    public void setRentVerified(boolean rentVerified) { this.rentVerified = rentVerified; }

    /** Polymorphism – returns verified badge */
    @Override
    public String renderBadge() { return "<span class=\"badge badge-verified\">✓ Verified Renter</span>"; }

    @Override public String toString() {
        return "VerifiedRenterReview{" + super.toString() + ", rentVerified=" + rentVerified + "}";
    }
}
