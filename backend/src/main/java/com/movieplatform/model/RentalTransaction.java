// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.Objects;

/**
 * RentalTransaction – base rental entity.
 * totalFee is private; computed internally (Encapsulation).
 */
@Document(collection = "rentals")
public class RentalTransaction {

    @Id
    private String id;
    private String userId;
    private String movieId;
    private LocalDate rentalDate;
    private LocalDate dueDate;
    private LocalDate returnedDate;
    private String status;      // ACTIVE | RETURNED | OVERDUE
    private double totalFee;   // computed internally – not set from outside

    public RentalTransaction() {}

    public RentalTransaction(String id, String userId, String movieId,
                              LocalDate rentalDate, LocalDate dueDate) {
        this.id = id;
        this.userId = userId;
        this.movieId = movieId;
        this.rentalDate = rentalDate;
        this.dueDate = dueDate;
        this.status = "ACTIVE";
        this.totalFee = 0.0;
    }

    /** Polymorphism hook – overridden per subclass */
    public double calculateLateFee() {
        if (returnedDate == null || !returnedDate.isAfter(dueDate)) return 0.0;
        long daysOverdue = (long) java.time.temporal.ChronoUnit.DAYS.between(dueDate, returnedDate);
        return daysOverdue * 1.5;  // base: $1.50/day
    }

    public void markReturned(LocalDate returnDate) {
        this.returnedDate = returnDate;
        this.status = "RETURNED";
        this.totalFee = calculateLateFee();   // computed internally
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }
    public LocalDate getRentalDate() { return rentalDate; }
    public void setRentalDate(LocalDate rentalDate) { this.rentalDate = rentalDate; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public LocalDate getReturnedDate() { return returnedDate; }
    public void setReturnedDate(LocalDate returnedDate) { this.returnedDate = returnedDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public double getTotalFee() { return totalFee; }
    public void setTotalFee(double totalFee) { this.totalFee = totalFee; } // Admin manual override

    @Override public String toString() {
        return "RentalTransaction{id='" + id + "', userId='" + userId +
               "', movieId='" + movieId + "', status='" + status + "'}";
    }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RentalTransaction r)) return false;
        return Objects.equals(id, r.id);
    }
    @Override public int hashCode() { return Objects.hash(id); }
}
