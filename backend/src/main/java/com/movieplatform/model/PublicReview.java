// IT25101901 – Thanuluxshan K. – Component 03: Review & Rating Management
package com.movieplatform.model;

import org.springframework.data.mongodb.core.mapping.Document;

/** PublicReview – any registered user can post (Inheritance). */
@Document(collection = "reviews")
public class PublicReview extends Review {
    public PublicReview() { super(); }
    public PublicReview(String id, String movieId, String userId, int starRating, String commentText) {
        super(id, movieId, userId, starRating, commentText);
    }
    /** Polymorphism – returns plain badge */
    @Override
    public String renderBadge() { return "<span class=\"badge\">User Review</span>"; }

    @Override public String toString() { return "PublicReview{" + super.toString() + "}"; }
}
