// IT25101540 – Gunathilaka H.D.T.T. – Component 05: Admin Management
package com.movieplatform.repository;

import com.movieplatform.model.Admin;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

import java.util.Optional;

/**
 * Repository layer for handling Admin database persistence operations (MongoDB)
 */
@Repository
public interface AdminRepository extends MongoRepository<Admin, String> {
    
    /** Custom query to find Admin by username, ensuring the document possesses an admin role field */
    @Query("{ 'username' : { $regex: ?0, $options: 'i' }, 'role': { $exists: true } }")
    Optional<Admin> findByUsernameIgnoreCase(String username);
    
    /** Fetches only documents that represent administrators by evaluating presence of the 'role' field */
    @Query("{ 'role' : { $exists: true } }")
    List<Admin> findAllAdmins();
}
