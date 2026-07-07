// IT25103586 – Navishika D.M.N.N. – Component 02: Movie Management
package com.movieplatform.service.impl;

import com.movieplatform.dto.MovieDTO;
import com.movieplatform.model.Movie;
import com.movieplatform.repository.MovieRepository;
import com.movieplatform.service.MovieService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;

    public MovieServiceImpl(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    @Override
    public MovieDTO add(MovieDTO dto) {
        // MongoDB will generate the ID, so we pass null for id.
        // imdbId is a final field, so it needs to be set in the constructor.
        // Assuming imdbId is still generated if not provided by DTO, or if it's an internal identifier.
        // If imdbId should come from the DTO, the MovieDTO and constructor need to be updated.
        // For now, keeping the random generation for imdbId as it was before.
        Movie m = new Movie(null, dto.getTitle(), dto.getGenre(),
                            dto.getReleaseYear(), dto.getSynopsis(), dto.getPosterUrl(),
                            UUID.randomUUID().toString().substring(0, 8), dto.getDirectorId());
        m.setTrailerUrl(dto.getTrailerUrl());
        if (dto.getActorIds() != null) m.setActorIds(dto.getActorIds());
        movieRepository.save(m);
        return toDTO(m);
    }

    @Override
    public List<MovieDTO> findAll() { return movieRepository.findAll().stream().map(this::toDTO).toList(); }

    @Override
    public Optional<MovieDTO> findById(String id) { return movieRepository.findById(id).map(this::toDTO); }

    @Override
    public List<MovieDTO> findByGenre(String genre) { return movieRepository.findByGenreIgnoreCase(genre).stream().map(this::toDTO).toList(); }

    @Override
    public List<MovieDTO> search(String keyword) { return movieRepository.findByTitleContainingIgnoreCase(keyword).stream().map(this::toDTO).toList(); }

    @Override
    public MovieDTO update(String id, MovieDTO dto) {
        Movie m = movieRepository.findById(id).orElseThrow(() -> new RuntimeException("Movie not found"));
        if (dto.getTitle() != null) m.setTitle(dto.getTitle());
        if (dto.getSynopsis() != null) m.setSynopsis(dto.getSynopsis());
        if (dto.getPosterUrl() != null) m.setPosterUrl(dto.getPosterUrl());
        if (dto.getTrailerUrl() != null) m.setTrailerUrl(dto.getTrailerUrl());
        if (dto.getDirectorId() != null) m.setDirectorId(dto.getDirectorId());
        if (dto.getActorIds() != null) m.setActorIds(dto.getActorIds());
        m.setAvailable(dto.isAvailable());
        movieRepository.save(m);
        return toDTO(m);
    }

    @Override
    public void delete(String id) { movieRepository.deleteById(id); }

    private MovieDTO toDTO(Movie m) {
        MovieDTO dto = new MovieDTO();
        dto.setId(m.getId()); dto.setTitle(m.getTitle()); dto.setGenre(m.getGenre());
        dto.setReleaseYear(m.getReleaseYear()); dto.setSynopsis(m.getSynopsis());
        dto.setPosterUrl(m.getPosterUrl()); dto.setTrailerUrl(m.getTrailerUrl());
        dto.setAverageRating(m.getAverageRating());
        dto.setDirectorId(m.getDirectorId()); dto.setActorIds(m.getActorIds());
        dto.setAvailable(m.isAvailable());
        return dto;
    }
}
