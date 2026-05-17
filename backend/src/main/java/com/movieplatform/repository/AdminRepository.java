// IT25101901 – Thanuluxshan K. – Component 05: Admin Management
package com.movieplatform.repository;

import com.movieplatform.model.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

/**
 * AdminRepository – MongoDB persistence.
 */
@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {
    @Query("{ 'username' : { $regex: ?0, $options: 'i' }, 'role': { $exists: true } }")
    Optional<Admin> findByUsernameIgnoreCase(String username);
    
    // Only fetch documents that have a 'role' field (filters out standard users)
    @Query("{ 'role' : { $exists: true } }")
    List<Admin> findAllAdmins();
}
