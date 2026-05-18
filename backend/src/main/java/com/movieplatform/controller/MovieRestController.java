// IT25103586 – Navishika D.M.N.N. – Component 02: Movie Management (SOA REST)
package com.movieplatform.controller;

import com.movieplatform.dto.MovieDTO;
import com.movieplatform.exception.ResourceNotFoundException;
import com.movieplatform.service.MovieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * MovieRestController – RESTful JSON API for movie catalogue management.
 * Base URL: /api/movies
 */
@RestController
@RequestMapping("/api/movies")
public class MovieRestController {

    private final MovieService movieService;

    public MovieRestController(MovieService movieService) {
        this.movieService = movieService;
    }

    /** GET /api/movies – List all movies; optional ?search= or ?genre= */
    @GetMapping
    public ResponseEntity<List<MovieDTO>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(movieService.search(search));
        }
        if (genre != null && !genre.isBlank()) {
            return ResponseEntity.ok(movieService.findByGenre(genre));
        }
        return ResponseEntity.ok(movieService.findAll());
    }

    /** GET /api/movies/{id} – Get single movie detail */
    @GetMapping("/{id}")
    public ResponseEntity<MovieDTO> findById(@PathVariable String id) {
        return movieService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found: " + id));
    }

    /** GET /api/movies/genre/{genre} – Browse by genre */
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<MovieDTO>> findByGenre(@PathVariable String genre) {
        return ResponseEntity.ok(movieService.findByGenre(genre));
    }

    /** POST /api/movies – Add a new movie (admin) */
    @PostMapping
    public ResponseEntity<MovieDTO> add(@RequestBody MovieDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(movieService.add(dto));
    }

    /** PUT /api/movies/{id} – Edit movie details (admin) */
    @PutMapping("/{id}")
    public ResponseEntity<MovieDTO> update(@PathVariable String id,
                                            @RequestBody MovieDTO dto) {
        return ResponseEntity.ok(movieService.update(id, dto));
    }

    /** DELETE /api/movies/{id} – Remove movie (admin) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        movieService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Movie deleted successfully"));
    }
}
