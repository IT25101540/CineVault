// IT25100813 – Luckshidhan K. – Component 06: Director & Cast (SOA REST)
package com.movieplatform.controller;

import com.movieplatform.dto.PersonDTO;
import com.movieplatform.exception.ResourceNotFoundException;
import com.movieplatform.service.PersonService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * PersonRestController – RESTful JSON API for directors and cast members.
 * Base URL: /api/people
 */
@RestController
@RequestMapping("/api/people")
public class PersonRestController {

    private final PersonService personService;

    public PersonRestController(PersonService personService) {
        this.personService = personService;
    }

    /** GET /api/people – List all; optional ?search= or ?type= */
    @GetMapping
    public ResponseEntity<List<PersonDTO>> findAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type) {
        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(personService.search(search));
        }
        if (type != null && !type.isBlank()) {
            return ResponseEntity.ok(personService.findByType(type));
        }
        return ResponseEntity.ok(personService.findAll());
    }

    /** GET /api/people/{id} – Person detail */
    @GetMapping("/{id}")
    public ResponseEntity<PersonDTO> findById(@PathVariable String id) {
        return personService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found: " + id));
    }

    /** GET /api/people/{id}/filmography – Movies by this person */
    @GetMapping("/{id}/filmography")
    public ResponseEntity<Map<String, Object>> filmography(@PathVariable String id) {
        PersonDTO person = personService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Person not found: " + id));
        return ResponseEntity.ok(Map.of(
                "person", person,
                "filmography", personService.getFilmography(id)
        ));
    }

    /** POST /api/people – Add a new director / cast member (admin) */
    @PostMapping
    public ResponseEntity<PersonDTO> add(@RequestBody PersonDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(personService.add(dto));
    }

    /** PUT /api/people/{id} – Update biography / photo / nationality */
    @PutMapping("/{id}")
    public ResponseEntity<PersonDTO> update(@PathVariable String id,
                                             @RequestBody PersonDTO dto) {
        return ResponseEntity.ok(personService.update(id, dto));
    }

    /** DELETE /api/people/{id} – Remove person (admin) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        personService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Person removed successfully"));
    }
}
