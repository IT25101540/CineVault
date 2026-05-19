// IT25102885 – Dhimantha W.L.T. – Component 01: User Management
package com.movieplatform.service;

import com.movieplatform.dto.UserDTO;
import com.movieplatform.model.User;

import java.util.List;
import java.util.Optional;

/**
 * UserService – Abstraction: hides file I/O from the controller layer.
 */
public interface UserService {
    UserDTO register(String username, String email, String password, String membershipType);
    Optional<UserDTO> login(String username, String password);
    Optional<UserDTO> findById(String id);
    List<UserDTO> findAll();
    UserDTO update(String id, String username, String email, String password, String membershipType, Boolean active);
    void deactivate(String id);
}
