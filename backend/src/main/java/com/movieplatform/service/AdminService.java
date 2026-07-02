// IT25101540 – Gunathilaka H.D.T.T. – Component 05: Admin Management
package com.movieplatform.service;

import com.movieplatform.dto.AdminDTO;
import com.movieplatform.dto.DashboardStats;
import java.util.List;
import java.util.Optional;

public interface AdminService {
    AdminDTO register(String username, String email, String password, String role, int permissionLevel);
    Optional<AdminDTO> login(String username, String password);
    List<AdminDTO> findAll();
    Optional<AdminDTO> findById(String id);
    AdminDTO update(String id, String role, int permissionLevel);
    void deactivate(String id);
    void activate(String id);
    void deleteById(String id);
    DashboardStats getDashboardStats();
}
