// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.service.impl;

import com.movieplatform.dto.RentalDTO;
import com.movieplatform.model.RentalTransaction;
import com.movieplatform.repository.RentalRepository;
import com.movieplatform.service.RentalService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class RentalServiceImpl implements RentalService {

    private final RentalRepository rentalRepository;

    public RentalServiceImpl(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    @Override
    public RentalDTO rentMovie(String userId, String movieId) {
        LocalDate today = LocalDate.now();
        LocalDate due = today.plusDays(7);
        RentalTransaction r = new RentalTransaction(null,
                userId, movieId, today, due);
        rentalRepository.save(r);
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
        if (r.getDueDate() != null && r.getDueDate().isBefore(LocalDate.now()) &&
                r.getReturnedDate() == null) {
            dto.setDaysOverdue((int) java.time.temporal.ChronoUnit.DAYS.between(r.getDueDate(), LocalDate.now()));
        }
        return dto;
    }
}
