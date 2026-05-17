// IT25100813 – Luckshidhan K. – Component 06: Director & Cast Management
package com.movieplatform.repository;

import com.movieplatform.model.Person;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * PersonRepository – MongoDB persistence.
 */
@Repository
public interface PersonRepository extends MongoRepository<Person, String> {
    
    List<Person> findByFullNameContainingIgnoreCase(String keyword);

    List<Person> findByCreditTypeIgnoreCaseOrCreditTypeIgnoreCase(String type1, String type2);
}
