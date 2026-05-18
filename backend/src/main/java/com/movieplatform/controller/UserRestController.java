// IT25102885 – Dhimantha W.L.T. – Component 01: User Management (SOA REST)
package com.movieplatform.controller;

import com.movieplatform.dto.UserDTO;
import com.movieplatform.exception.ResourceNotFoundException;
import com.movieplatform.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * UserRestController – exposes user operations as RESTful JSON endpoints.
 * Angular frontend consumes these via HttpClient.
 * Base URL: /api/users
 */
@RestController
@RequestMapping("/api/users")
public class UserRestController {

    private final UserService userService;

    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    /** POST /api/users/register – Register a new user */
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody Map<String, String> body) {
        UserDTO dto = userService.register(
                body.get("username"),
                body.get("email"),
                body.get("password"),
                body.getOrDefault("membershipType", "FREE")
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /** POST /api/users/login – Authenticate and return user info */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            java.util.Optional<UserDTO> result = userService.login(
                body.get("username"), body.get("password")
            );
            if (result.isPresent()) {
                return ResponseEntity.ok(result.get());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid username or password"));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Login failed"));
        }
    }

    /** GET /api/users – List all users (admin only) */
    @GetMapping
    public ResponseEntity<List<UserDTO>> findAll() {
        return ResponseEntity.ok(userService.findAll());
    }

    /** GET /api/users/{id} – Get user by ID */
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> findById(@PathVariable String id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    /** PUT /api/users/{id} – Update user profile */
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable String id,
                                          @RequestBody Map<String, String> body) {
        UserDTO updated = userService.update(id,
                body.get("email"),
                body.get("password"),
                body.get("membershipType"));
        return ResponseEntity.ok(updated);
    }

    /** DELETE /api/users/{id} – Soft-delete (deactivate) a user */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        userService.deactivate(id);
        return ResponseEntity.ok(Map.of("message", "User deactivated successfully"));
    }
}
