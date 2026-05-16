// IT25101901 – Thanuluxshan K. – Component 05: Admin Management
package com.movieplatform.model;

import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Admin – extends User (Inheritance).
 * permissionLevel changed only via grantPermission() (Encapsulation).
 */
@Document(collection = "users")
public class Admin extends User {

    private String role;           // SUPER_ADMIN | MODERATOR
    private int permissionLevel;   // private – Encapsulation
    private LocalDateTime lastLogin;

    public Admin() { super(); }

    public Admin(String id, String username, String email, String passwordHash,
                 String role, int permissionLevel) {
        super(id, username, email, passwordHash, "ADMIN");
        this.role = role;
        this.permissionLevel = permissionLevel;
    }

    /** Encapsulation: permission changed only via controlled method */
    public void grantPermission(int level) {
        if (level < 1 || level > 5) throw new IllegalArgumentException("Invalid permission level");
        this.permissionLevel = level;
    }

    /** Polymorphism: behaviour differs per role */
    public boolean canDelete(String entityType) {
        return "SUPER_ADMIN".equals(role) || (permissionLevel >= 3);
    }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public int getPermissionLevel() { return permissionLevel; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    @Override public String toString() {
        return "Admin{" + super.toString() + ", role='" + role + "', permissionLevel=" + permissionLevel + "}";
    }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Admin a)) return false;
        return Objects.equals(getId(), a.getId());
    }
    @Override public int hashCode() { return Objects.hash(getId()); }
}
