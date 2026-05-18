// IT25102885 – Dhimantha W.L.T. – Component 01: User Management
package com.movieplatform.repository;

import com.movieplatform.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

/**
 * UserRepository – MongoDB persistence.
 */
@Repository
public interface UserRepository extends MongoRepository<User, String> {
    @Query("{ 'username' : { $regex: ?0, $options: 'i' }, 'role': { $exists: false } }")
    Optional<User> findByUsernameIgnoreCase(String username);
    
    // Only fetch documents that DO NOT have a 'role' field (filters out admins)
    @Query("{ 'role' : { $exists: false } }")
    List<User> findAllUsers();
}
