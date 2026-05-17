// IT25102885 – Dhimantha W.L.T. – Component 01: User Management
package com.movieplatform.model;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * AdminUser – extends User (Inheritance).
 * Has elevated privileges. authenticate() is overridden (Polymorphism).
 */
@Document(collection = "users")
public class AdminUser extends User {

    private boolean isSuperAdmin;

    public AdminUser() { super(); }

    public AdminUser(String id, String username, String email,
                     String passwordHash, boolean isSuperAdmin) {
        super(id, username, email, passwordHash, "ADMIN");
        this.isSuperAdmin = isSuperAdmin;
    }

    public boolean isSuperAdmin() { return isSuperAdmin; }
    public void setSuperAdmin(boolean superAdmin) { isSuperAdmin = superAdmin; }

    public void manageUsers() {
        // Admin-only: triggers user listing logic via service
    }

    /** Polymorphism – admins bypass membership checks */
    @Override
    public boolean authenticate(String rawPassword) {
        return isActive() && super.authenticate(rawPassword);
    }

    @Override
    public String toString() {
        return "AdminUser{" + super.toString() + ", isSuperAdmin=" + isSuperAdmin + "}";
    }
}
