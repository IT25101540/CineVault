// IT25101540 – Gunathilaka H.D.T.T. – Component 05: Admin Management
package com.movieplatform.service.impl;

import com.movieplatform.dto.AdminDTO;
import com.movieplatform.dto.DashboardStats;
import com.movieplatform.model.Admin;
import com.movieplatform.repository.AdminRepository;
import com.movieplatform.service.AdminService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;

    public AdminServiceImpl(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public AdminDTO register(String username, String email, String password,
                             String role, int permissionLevel) {
        Admin a = new Admin(null, username, email,
                            hashPassword(password), role, permissionLevel);
        adminRepository.save(a);
        return toDTO(a);
    }

    @Override
    public Optional<AdminDTO> login(String username, String password) {
        return adminRepository.findByUsernameIgnoreCase(username)
                .filter(a -> a.isActive())
                .filter(a -> a.authenticate(hashPassword(password)))
                .map(this::toDTO);
    }

    @Override
    public List<AdminDTO> findAll() {
        return adminRepository.findAllAdmins().stream().map(this::toDTO).toList();
    }

    @Override
    public Optional<AdminDTO> findById(String id) {
        return adminRepository.findById(id).map(this::toDTO);
    }

    @Override
    public AdminDTO update(String id, String role, int permissionLevel) {
        Admin a = adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found"));
        if (role != null) a.setRole(role);
        if (permissionLevel > 0) a.grantPermission(permissionLevel);
        adminRepository.save(a);
        return toDTO(a);
    }

    @Override
    public void deactivate(String id) {
        Admin a = adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found"));
        a.setActive(false);
        adminRepository.save(a);
    }

    @Override
    public void activate(String id) {
        Admin a = adminRepository.findById(id).orElseThrow(() -> new RuntimeException("Admin not found"));
        a.setActive(true);
        adminRepository.save(a);
    }

    /** Abstraction: aggregates data from all services */
    @Override
    public DashboardStats getDashboardStats() {
        // Return dummy/mock statistics for now as other components' repositories are not included in this build
        long users = 12L;
        long movies = 3L;
        long activeRentals = 5L;
        long flagged = 2L;
        return new DashboardStats(users, movies, activeRentals, flagged);
    }

    private String hashPassword(String raw) { return Integer.toHexString(raw.hashCode()); }

    private AdminDTO toDTO(Admin a) {
        AdminDTO dto = new AdminDTO();
        dto.setId(a.getId()); dto.setUsername(a.getUsername()); dto.setEmail(a.getEmail());
        dto.setRole(a.getRole()); dto.setPermissionLevel(a.getPermissionLevel()); dto.setActive(a.isActive());
        return dto;
    }
}
