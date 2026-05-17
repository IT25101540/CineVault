// IT25101901 – Thanuluxshan K. – Component 05: Admin Management
package com.movieplatform.dto;

public class AdminDTO {
    private String id;
    private String username;
    private String email;
    private String role;
    private int permissionLevel;
    private boolean active;

    public AdminDTO() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public int getPermissionLevel() { return permissionLevel; }
    public void setPermissionLevel(int permissionLevel) { this.permissionLevel = permissionLevel; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    @Override public String toString() { return "AdminDTO{id='" + id + "', role='" + role + "'}"; }
}
