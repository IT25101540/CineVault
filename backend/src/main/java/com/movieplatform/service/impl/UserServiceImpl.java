// IT25102885 – Dhimantha W.L.T. – Component 01: User Management
package com.movieplatform.service.impl;

import com.movieplatform.dto.UserDTO;
import com.movieplatform.model.RegularUser;
import com.movieplatform.model.User;
import com.movieplatform.repository.UserRepository;
import com.movieplatform.service.UserService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDTO register(String username, String email, String password, String membershipType) {
        RegularUser user = new RegularUser(null, username, email, hashPassword(password), membershipType);
        userRepository.save(user);
        return toDTO(user);
    }

    @Override
    public Optional<UserDTO> login(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsernameIgnoreCase(username);
        
        if (userOpt.isEmpty()) return Optional.empty();
        
        User user = userOpt.get();
        
        if (!user.isActive()) {
            throw new RuntimeException("Account is locked or inactive. Please contact support.");
        }
        
        if (user.authenticate(hashPassword(password))) {
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
            return Optional.of(toDTO(user));
        } else {
            int attempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(attempts);
            if (attempts >= 5) {
                user.setActive(false);
            }
            userRepository.save(user);
            
            if (!user.isActive()) {
                throw new RuntimeException("Account locked due to 5 failed attempts.");
            }
            return Optional.empty();
        }
    }

    @Override
    public Optional<UserDTO> findById(String id) {
        return userRepository.findById(id).map(this::toDTO);
    }

    @Override
    public List<UserDTO> findAll() {
        return userRepository.findAllUsers().stream().map(this::toDTO).toList();
    }

    @Override
    public UserDTO update(String id, String email, String password, String membershipType) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        if (email != null && !email.isBlank()) user.setEmail(email);
        if (password != null && !password.isBlank()) user.setPasswordHash(hashPassword(password));
        if (membershipType != null && !membershipType.isBlank()) user.setMembershipType(membershipType);
        userRepository.save(user);
        return toDTO(user);
    }

    @Override
    public void deactivate(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setActive(false);
        userRepository.save(user);
    }

    private String hashPassword(String raw) {
        // Simple hash for demo; use BCrypt in production
        return Integer.toHexString(raw.hashCode());
    }

    private UserDTO toDTO(User u) {
        return new UserDTO(u.getId(), u.getUsername(), u.getEmail(),
                           u.getMembershipType(), u.isActive());
    }
}
