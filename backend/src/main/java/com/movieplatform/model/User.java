// IT25102885 – Dhimantha W.L.T. – Component 01: User Management
package com.movieplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Base User entity. Encapsulates sensitive fields behind getters/setters.
 * AdminUser and RegularUser extend this class (Inheritance).
 */
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String username;
    private String email;
    private String passwordHash;   // never exposed in DTO
    private String membershipType; // FREE | PREMIUM
    private boolean active;
    private int failedLoginAttempts;
    private LocalDateTime createdAt;

    public User() {}

    public User(String id, String username, String email, String passwordHash,
                String membershipType) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.membershipType = membershipType;
        this.active = true;
        this.failedLoginAttempts = 0;
        this.createdAt = LocalDateTime.now();
    }

    // --- Encapsulation: getters/setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    /** Password hash – never exposed to view layer */
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getMembershipType() { return membershipType; }
    public void setMembershipType(String membershipType) { this.membershipType = membershipType; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public int getFailedLoginAttempts() { return failedLoginAttempts; }
    public void setFailedLoginAttempts(int attempts) { this.failedLoginAttempts = attempts; }

    /** Polymorphism hook – overridden in subclasses */
    public boolean authenticate(String rawPassword) {
        // Base: simple hash comparison (subclasses override for extra rules)
        return Objects.equals(this.passwordHash, rawPassword);
    }

    @Override
    public String toString() {
        return "User{id='" + id + "', username='" + username + "', email='" + email +
               "', membershipType='" + membershipType + "', active=" + active + "}";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User u)) return false;
        return Objects.equals(id, u.id);
    }

    @Override
    public int hashCode() { return Objects.hash(id); }
}
