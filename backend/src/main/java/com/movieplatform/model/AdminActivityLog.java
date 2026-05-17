// IT25101901 – Thanuluxshan K. – Component 05: Admin Management
package com.movieplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.Objects;

/** AdminActivityLog – records every admin action with a timestamp. */
@Document(collection = "admin_logs")
public class AdminActivityLog {

    @Id
    private String id;
    private String adminId;
    private String action;
    private String targetEntityType;
    private String targetEntityId;
    private LocalDateTime timestamp;

    public AdminActivityLog() {}

    public AdminActivityLog(String id, String adminId, String action,
                             String targetEntityType, String targetEntityId) {
        this.id = id;
        this.adminId = adminId;
        this.action = action;
        this.targetEntityType = targetEntityType;
        this.targetEntityId = targetEntityId;
        this.timestamp = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAdminId() { return adminId; }
    public void setAdminId(String adminId) { this.adminId = adminId; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getTargetEntityType() { return targetEntityType; }
    public void setTargetEntityType(String t) { this.targetEntityType = t; }
    public String getTargetEntityId() { return targetEntityId; }
    public void setTargetEntityId(String t) { this.targetEntityId = t; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    @Override public String toString() {
        return "AdminActivityLog{adminId='" + adminId + "', action='" + action + "', timestamp=" + timestamp + "}";
    }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AdminActivityLog l)) return false;
        return Objects.equals(id, l.id);
    }
    @Override public int hashCode() { return Objects.hash(id); }
}
