// IT25103586 – Navishika D.M.N.N. – Component 02: Movie Management
package com.movieplatform.repository;

import com.movieplatform.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * MovieRepository – MongoDB persistence.
 */
@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {
    
    List<Movie> findByGenreIgnoreCase(String genre);

    List<Movie> findByTitleContainingIgnoreCase(String title);
}
