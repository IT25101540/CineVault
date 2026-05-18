// IT25102885 – Dhimantha W.L.T. – Component 01: User Management
package com.movieplatform.model;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * RegularUser – extends User (Inheritance).
 * Adds rental and review-limit capabilities.
 */
@Document(collection = "users")
public class RegularUser extends User {

    private int activeRentals;
    private static final int MAX_RENTALS = 3;
    private static final int REVIEW_LIMIT = 10;

    public RegularUser() { super(); }

    public RegularUser(String id, String username, String email,
                       String passwordHash, String membershipType) {
        super(id, username, email, passwordHash, membershipType);
        this.activeRentals = 0;
    }

    public boolean canRent() {
        return activeRentals < MAX_RENTALS && isActive();
    }

    public int reviewLimit() {
        return "PREMIUM".equalsIgnoreCase(getMembershipType()) ? REVIEW_LIMIT * 2 : REVIEW_LIMIT;
    }

    public int getActiveRentals() { return activeRentals; }
    public void setActiveRentals(int activeRentals) { this.activeRentals = activeRentals; }

    /** Polymorphism – override authenticate with extra active-account check */
    @Override
    public boolean authenticate(String rawPassword) {
        return isActive() && super.authenticate(rawPassword);
    }

    @Override
    public String toString() {
        return "RegularUser{" + super.toString() + ", activeRentals=" + activeRentals + "}";
    }
}
