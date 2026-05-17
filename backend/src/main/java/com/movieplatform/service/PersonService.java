// IT25100813 – Luckshidhan K. – Component 06: Director & Cast Management
package com.movieplatform.service;

import com.movieplatform.dto.PersonDTO;
import java.util.List;
import java.util.Optional;

/** PersonService – Abstraction hides join logic from controller. */
public interface PersonService {
    PersonDTO add(PersonDTO dto);
    List<PersonDTO> findAll();
    Optional<PersonDTO> findById(String id);
    List<PersonDTO> search(String keyword);
    List<PersonDTO> findByType(String creditType);
    PersonDTO update(String id, PersonDTO dto);
    void delete(String id);
    List<String> getFilmography(String personId);
}
