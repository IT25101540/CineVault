// IT25103586 – Navishika D.M.N.N. – Component 02: Movie Management
package com.movieplatform.service;

import com.movieplatform.dto.MovieDTO;
import java.util.List;
import java.util.Optional;

/** MovieService – Abstraction: hides file parsing from controller. */
public interface MovieService {
    MovieDTO add(MovieDTO dto);
    List<MovieDTO> findAll();
    Optional<MovieDTO> findById(String id);
    List<MovieDTO> findByGenre(String genre);
    List<MovieDTO> search(String keyword);
    MovieDTO update(String id, MovieDTO dto);
    void delete(String id);
}
