// IT25100813 – Luckshidhan K. – Component 06: Director & Cast Management
package com.movieplatform.service.impl;

import com.movieplatform.dto.PersonDTO;
import com.movieplatform.model.Person;
import com.movieplatform.repository.MovieRepository;
import com.movieplatform.repository.PersonRepository;
import com.movieplatform.service.PersonService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PersonServiceImpl implements PersonService {

    private final PersonRepository personRepository;
    private final MovieRepository movieRepository;

    public PersonServiceImpl(PersonRepository personRepository, MovieRepository movieRepository) {
        this.personRepository = personRepository;
        this.movieRepository = movieRepository;
    }

    @Override
    public PersonDTO add(PersonDTO dto) {
        Person p = new Person(null, dto.getFullName(),
                dto.getNationality(), dto.getBirthYear(), dto.getBiography(),
                dto.getPhotoUrl(), dto.getCreditType());
        personRepository.save(p);
        return toDTO(p);
    }

    @Override
    public List<PersonDTO> findAll() {
        return personRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public Optional<PersonDTO> findById(String id) {
        return personRepository.findById(id).map(this::toDTO);
    }

    @Override
    public List<PersonDTO> search(String keyword) {
        return personRepository.findByFullNameContainingIgnoreCase(keyword).stream().map(this::toDTO).toList();
    }

    @Override
    public List<PersonDTO> findByType(String creditType) {
        return personRepository.findByCreditTypeIgnoreCaseOrCreditTypeIgnoreCase(creditType, "BOTH").stream().map(this::toDTO).toList();
    }

    @Override
    public PersonDTO update(String id, PersonDTO dto) {
        Person p = personRepository.findById(id).orElseThrow(() -> new RuntimeException("Person not found"));
        if (dto.getBiography() != null) p.setBiography(dto.getBiography());
        if (dto.getPhotoUrl() != null) p.setPhotoUrl(dto.getPhotoUrl());
        if (dto.getNationality() != null) p.setNationality(dto.getNationality());
        p.setActive(dto.isActive());
        personRepository.save(p);
        return toDTO(p);
    }

    @Override
    public void delete(String id) { personRepository.deleteById(id); }

    /** Abstraction: hides movie join logic */
    @Override
    public List<String> getFilmography(String personId) {
        return movieRepository.findAll().stream()
                .filter(m -> personId.equals(m.getDirectorId()))
                .map(m -> m.getTitle() + " (" + m.getReleaseYear() + ")")
                .toList();
    }

    private PersonDTO toDTO(Person p) {
        PersonDTO dto = new PersonDTO();
        dto.setId(p.getId()); dto.setFullName(p.getFullName());
        dto.setNationality(p.getNationality()); dto.setBirthYear(p.getBirthYear());
        dto.setBiography(p.getBiography()); dto.setPhotoUrl(p.getPhotoUrl());
        dto.setCreditType(p.getCreditType());
        dto.setActive(p.isActive());
        return dto;
    }
}
