// IT25101540 – Gunathilaka H.D.T.T. – Component 05: Admin Management (SOA REST)
package com.movieplatform.controller;

import com.movieplatform.dto.AdminDTO;
import com.movieplatform.dto.DashboardStats;
import com.movieplatform.exception.ResourceNotFoundException;
import com.movieplatform.service.AdminService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * AdminRestController – RESTful JSON API for admin management.
 * Base URL: /api/admin
 */
@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final AdminService adminService;
    private final com.movieplatform.service.RevenueService revenueService;
    private final com.movieplatform.repository.PromoCodeRepository promoCodeRepository;

    public AdminRestController(AdminService adminService,
                               com.movieplatform.service.RevenueService revenueService,
                               com.movieplatform.repository.PromoCodeRepository promoCodeRepository) {
        this.adminService = adminService;
        this.revenueService = revenueService;
        this.promoCodeRepository = promoCodeRepository;
    }

    /** POST /api/admin/login – Admin authentication */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        java.util.Optional<AdminDTO> result = adminService.login(
            body.get("username"), body.get("password")
        );
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid admin credentials"));
        }
    }

    /** GET /api/admin/dashboard – Aggregate stats for dashboard */
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> dashboard() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    /** GET /api/admin – List all admins */
    @GetMapping
    public ResponseEntity<List<AdminDTO>> findAll() {
        return ResponseEntity.ok(adminService.findAll());
    }

    /** GET /api/admin/{id} – Get admin by ID */
    @GetMapping("/{id}")
    public ResponseEntity<AdminDTO> findById(@PathVariable String id) {
        return adminService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + id));
    }

    /** POST /api/admin/register – Register a new admin (super-admin only) */
    @PostMapping("/register")
    public ResponseEntity<AdminDTO> register(@RequestBody Map<String, Object> body) {
        AdminDTO dto = adminService.register(
                (String) body.get("username"),
                (String) body.get("email"),
                (String) body.get("password"),
                (String) body.get("role"),
                Integer.parseInt(body.getOrDefault("permissionLevel", "2").toString())
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /** PUT /api/admin/{id} – Update admin role/permissions */
    @PutMapping("/{id}")
    public ResponseEntity<AdminDTO> update(@PathVariable String id,
                                            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(adminService.update(
                id,
                (String) body.get("role"),
                Integer.parseInt(body.getOrDefault("permissionLevel", "2").toString())
        ));
    }

    /** DELETE /api/admin/{id} – Deactivate admin (super-admin only) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        adminService.deactivate(id);
        return ResponseEntity.ok(Map.of("message", "Admin deactivated successfully"));
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Map<String, String>> activate(@PathVariable String id) {
        adminService.activate(id);
        return ResponseEntity.ok(Map.of("message", "Admin activated successfully"));
    }

    /** GET /api/admin/revenue – Get revenue stats */
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Double>> getRevenueStats() {
        return ResponseEntity.ok(revenueService.getRevenueStats());
    }

    /** POST /api/admin/promocodes – Generate a promo code */
    @PostMapping("/promocodes")
    public ResponseEntity<com.movieplatform.model.PromoCode> generatePromoCode(@RequestBody Map<String, Object> body) {
        String code = body.get("code") != null ? body.get("code").toString().trim().toUpperCase() : "";
        double discount = Double.parseDouble(body.get("discountPercentage").toString());
        com.movieplatform.model.PromoCode promo = new com.movieplatform.model.PromoCode(null, code, discount, true);
        return ResponseEntity.ok(promoCodeRepository.save(promo));
    }
}
