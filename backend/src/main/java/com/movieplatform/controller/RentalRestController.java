// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management (SOA REST)
package com.movieplatform.controller;

import com.movieplatform.dto.RentalDTO;
import com.movieplatform.exception.ResourceNotFoundException;
import com.movieplatform.service.RentalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * RentalRestController – RESTful JSON API for rental lifecycle management.
 * Base URL: /api/rentals
 */
@RestController
@RequestMapping("/api/rentals")
public class RentalRestController {

    private final RentalService rentalService;

    public RentalRestController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    /** GET /api/rentals – All rentals (admin) */
    @GetMapping
    public ResponseEntity<List<RentalDTO>> findAll() {
        return ResponseEntity.ok(rentalService.findAll());
    }

    /** GET /api/rentals/user/{userId} – Rentals for a specific user */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RentalDTO>> findByUser(@PathVariable String userId) {
        return ResponseEntity.ok(rentalService.findByUser(userId));
    }

    /** GET /api/rentals/{id} – Get single rental */
    @GetMapping("/{id}")
    public ResponseEntity<RentalDTO> findById(@PathVariable String id) {
        return rentalService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Rental not found: " + id));
    }

    /** POST /api/rentals – Create a new rental */
    @PostMapping
    public ResponseEntity<RentalDTO> rent(@RequestBody Map<String, String> body) {
        String promoCode = body.getOrDefault("promoCode", "");
        String paymentMethod = body.getOrDefault("paymentMethod", "Credit Card");
        RentalDTO dto = rentalService.rentMovie(body.get("userId"), body.get("movieId"), promoCode, paymentMethod);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /** PUT /api/rentals/{id}/return – Mark a rental as returned */
    @PutMapping("/{id}/return")
    public ResponseEntity<RentalDTO> returnMovie(@PathVariable String id) {
        return ResponseEntity.ok(rentalService.returnMovie(id));
    }

    /** PUT /api/rentals/{id} – Edit/Update rental details (admin) */
    @PutMapping("/{id}")
    public ResponseEntity<RentalDTO> update(@PathVariable String id,
                                            @RequestBody Map<String, Object> body) {
        String status = body.get("status") != null ? body.get("status").toString() : null;
        java.time.LocalDate rentalDate = body.get("rentalDate") != null ? java.time.LocalDate.parse(body.get("rentalDate").toString()) : null;
        java.time.LocalDate dueDate = body.get("dueDate") != null ? java.time.LocalDate.parse(body.get("dueDate").toString()) : null;
        java.time.LocalDate returnedDate = body.get("returnedDate") != null && !body.get("returnedDate").toString().isBlank() 
                ? java.time.LocalDate.parse(body.get("returnedDate").toString()) : null;
        Double totalFee = body.get("totalFee") != null ? Double.parseDouble(body.get("totalFee").toString()) : null;

        return ResponseEntity.ok(rentalService.update(id, status, rentalDate, dueDate, returnedDate, totalFee));
    }

    /** DELETE /api/rentals/{id} – Remove a rental record (admin) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        rentalService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Rental record removed successfully"));
    }
}
