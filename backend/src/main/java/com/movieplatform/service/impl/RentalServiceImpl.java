// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.service.impl;

import com.movieplatform.dto.RentalDTO;
import com.movieplatform.model.RentalTransaction;
import com.movieplatform.repository.RentalRepository;
import com.movieplatform.repository.UserRepository;
import com.movieplatform.repository.MovieRepository;
import com.movieplatform.service.RentalService;
import com.movieplatform.service.PaymentService;
import com.movieplatform.service.EmailNotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class RentalServiceImpl implements RentalService {

    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final PaymentService paymentService;
    private final EmailNotificationService emailService;
    private final com.movieplatform.repository.PromoCodeRepository promoRepo;

    public RentalServiceImpl(RentalRepository rentalRepository, UserRepository userRepository, MovieRepository movieRepository,
                             PaymentService paymentService, EmailNotificationService emailService,
                             com.movieplatform.repository.PromoCodeRepository promoRepo) {
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
        this.movieRepository = movieRepository;
        this.paymentService = paymentService;
        this.emailService = emailService;
        this.promoRepo = promoRepo;
    }

    @Override
    public RentalDTO rentMovie(String userId, String movieId, String promoCode, String paymentMethod) {
        LocalDate today = LocalDate.now();
        LocalDate due = today.plusDays(7);
        
        // Check user membership: Premium or Elite get LKR 0 rentals. Free users pay LKR 500.
        boolean isPremiumOrElite = false;
        java.util.Optional<com.movieplatform.model.User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            String mType = userOpt.get().getMembershipType();
            if (mType != null && ("PREMIUM".equalsIgnoreCase(mType) || "ELITE".equalsIgnoreCase(mType))) {
                isPremiumOrElite = true;
            }
        }
        
        double baseFee = isPremiumOrElite ? 0.0 : 500.0;
        double discount = 0.0;
        
        if (promoCode != null && !promoCode.isBlank()) {
            java.util.Optional<com.movieplatform.model.PromoCode> promoOpt = promoRepo.findByCode(promoCode.trim().toUpperCase());
            if (promoOpt.isPresent() && promoOpt.get().isActive()) {
                discount = promoOpt.get().getDiscountPercentage();
            }
        }
        
        double finalFee = baseFee - (baseFee * discount / 100);
        
        // Process payment
        paymentService.processPayment(userId, finalFee, paymentMethod);

        RentalTransaction r = new RentalTransaction(null,
                userId, movieId, today, due);
        r.setTotalFee(finalFee);
        r.setPaymentMethod(paymentMethod);
        if (promoCode != null && !promoCode.isBlank()) {
            r.setPromoCode(promoCode.trim().toUpperCase());
        }
        rentalRepository.save(r);
        
        // Send email receipt
        userOpt.ifPresent(u -> {
            emailService.sendInvoice(u.getEmail(), r.getId(), finalFee);
        });

        return toDTO(r);
    }

    @Override
    public List<RentalDTO> findByUser(String userId) {
        return rentalRepository.findByUserId(userId).stream().map(this::toDTO).toList();
    }

    @Override
    public List<RentalDTO> findAll() {
        return rentalRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Override
    public Optional<RentalDTO> findById(String id) {
        return rentalRepository.findById(id).map(this::toDTO);
    }

    @Override
    public RentalDTO returnMovie(String rentalId) {
        RentalTransaction r = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new RuntimeException("Rental not found"));
        r.markReturned(LocalDate.now());
        rentalRepository.save(r);
        return toDTO(r);
    }

    @Override
    public void delete(String id) { rentalRepository.deleteById(id); }

    @Override
    public RentalDTO update(String id, String status, LocalDate rentalDate, LocalDate dueDate, LocalDate returnedDate, Double totalFee) {
        RentalTransaction r = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rental not found: " + id));
        if (status != null && !status.isBlank()) r.setStatus(status.toUpperCase());
        if (rentalDate != null) r.setRentalDate(rentalDate);
        if (dueDate != null) r.setDueDate(dueDate);
        
        if (returnedDate != null) {
            r.setReturnedDate(returnedDate);
            if (!"RETURNED".equalsIgnoreCase(r.getStatus())) {
                r.setStatus("RETURNED");
            }
        } else {
            r.setReturnedDate(null);
        }

        if (totalFee != null) {
            r.setTotalFee(totalFee);
        } else if ("RETURNED".equalsIgnoreCase(r.getStatus()) && r.getReturnedDate() != null) {
            r.markReturned(r.getReturnedDate());
        } else {
            r.setTotalFee(0.0);
        }

        rentalRepository.save(r);
        return toDTO(r);
    }

    private RentalDTO toDTO(RentalTransaction r) {
        RentalDTO dto = new RentalDTO();
        dto.setId(r.getId()); dto.setUserId(r.getUserId()); dto.setMovieId(r.getMovieId());
        dto.setRentalDate(r.getRentalDate()); dto.setDueDate(r.getDueDate());
        dto.setReturnedDate(r.getReturnedDate()); dto.setStatus(r.getStatus());
        dto.setTotalFee(r.getTotalFee());
        dto.setPaymentMethod(r.getPaymentMethod());
        dto.setPromoCode(r.getPromoCode());
        if (r.getDueDate() != null && r.getDueDate().isBefore(LocalDate.now()) &&
                r.getReturnedDate() == null) {
            dto.setDaysOverdue((int) java.time.temporal.ChronoUnit.DAYS.between(r.getDueDate(), LocalDate.now()));
        }

        // Resolve username and email from userId
        if (userRepository != null && r.getUserId() != null) {
            userRepository.findById(r.getUserId()).ifPresent(u -> {
                dto.setUsername(u.getUsername());
                dto.setUserEmail(u.getEmail());
            });
        }
        if (dto.getUsername() == null) dto.setUsername(r.getUserId());

        // Resolve movie title from movieId
        if (movieRepository != null && r.getMovieId() != null) {
            movieRepository.findById(r.getMovieId()).ifPresent(m -> {
                dto.setMovieTitle(m.getTitle());
            });
        }
        if (dto.getMovieTitle() == null) dto.setMovieTitle("Unknown Movie (" + r.getMovieId() + ")");

        return dto;
    }
}
