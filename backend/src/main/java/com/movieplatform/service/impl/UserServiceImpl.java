// IT25102885 – Dhimantha W.L.T. – Component 01: User Management
package com.movieplatform.service.impl;

import com.movieplatform.dto.UserDTO;
import com.movieplatform.model.RegularUser;
import com.movieplatform.model.User;
import com.movieplatform.repository.UserRepository;
import com.movieplatform.service.UserService;
import org.springframework.stereotype.Service;

import com.movieplatform.service.PaymentService;
import com.movieplatform.service.EmailNotificationService;

import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PaymentService paymentService;
    private final EmailNotificationService emailService;

    public UserServiceImpl(UserRepository userRepository, PaymentService paymentService, EmailNotificationService emailService) {
        this.userRepository = userRepository;
        this.paymentService = paymentService;
        this.emailService = emailService;
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
    public UserDTO update(String id, String username, String email, String password, String membershipType, Boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        if (username != null && !username.isBlank()) user.setUsername(username);
        if (email != null && !email.isBlank()) user.setEmail(email);
        if (password != null && !password.isBlank()) user.setPasswordHash(hashPassword(password));
        
        // If membership type is changing (e.g. upgrading)
        if (membershipType != null && !membershipType.isBlank() && !membershipType.equalsIgnoreCase(user.getMembershipType())) {
            double price = 0.0;
            if ("PREMIUM".equalsIgnoreCase(membershipType)) {
                price = 2500.0;
            } else if ("ELITE".equalsIgnoreCase(membershipType)) {
                price = 5800.0;
            }
            
            user.setMembershipType(membershipType.toUpperCase());
            
            // Only process payment and send invoice if upgrading to a paid tier
            if (price > 0.0) {
                paymentService.processPayment(user.getId(), price, "Membership Billing");
                String invoiceId = "SUB-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                String planName  = "PREMIUM".equalsIgnoreCase(membershipType) ? "CinePremium" : "CineElite";
                java.time.LocalDate today    = java.time.LocalDate.now();
                java.time.LocalDate nextMonth = today.plusMonths(1);
                emailService.sendInvoice(
                        user.getEmail(),
                        invoiceId,
                        price,
                        planName + " – Monthly Membership",
                        today,
                        nextMonth,
                        "Membership Billing",
                        user.getUsername() != null ? user.getUsername() : user.getEmail()
                );
            }
        }
        
        if (active != null) user.setActive(active);
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

    @Override
    public UserDTO suspend(String id, String reason) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
        user.setActive(false);
        // Note: Currently User model doesn't have a suspendReason field.
        // We simulate suspension by deactivating them.
        userRepository.save(user);
        return toDTO(user);
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
