// IT25102885 – Dhimantha W.L.T. – Component 01: User Management
package com.movieplatform.dto;

/**
 * UserDTO – Data Transfer Object. No passwordHash field (Encapsulation).
 */
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String membershipType;
    private boolean active;

    public UserDTO() {}

    public UserDTO(String id, String username, String email,
                   String membershipType, boolean active) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.membershipType = membershipType;
        this.active = active;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getMembershipType() { return membershipType; }
    public void setMembershipType(String membershipType) { this.membershipType = membershipType; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    @Override public String toString() {
        return "UserDTO{id='" + id + "', username='" + username + "'}";
    }
}
