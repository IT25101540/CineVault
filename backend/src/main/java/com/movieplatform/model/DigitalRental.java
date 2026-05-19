// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.model;

import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

/** DigitalRental – extends RentalTransaction (Inheritance). */
@Document(collection = "rentals")
public class DigitalRental extends RentalTransaction {

    private String streamToken;
    private int watchDeadlineHours;

    public DigitalRental() { super(); }

    public DigitalRental(String id, String userId, String movieId,
                          LocalDate rentalDate, LocalDate dueDate,
                          String streamToken, int watchDeadlineHours) {
        super(id, userId, movieId, rentalDate, dueDate);
        this.streamToken = streamToken;
        this.watchDeadlineHours = watchDeadlineHours;
    }

    /** Polymorphism – digital charges $0.50/hour overdue */
    @Override
    public double calculateLateFee() {
        if (getReturnedDate() == null || !getReturnedDate().isAfter(getDueDate())) return 0.0;
        long hours = (long) java.time.temporal.ChronoUnit.DAYS.between(getDueDate(), getReturnedDate()) * 24L;
        return hours * 50.0;
    }

    public String getStreamToken() { return streamToken; }
    public void setStreamToken(String streamToken) { this.streamToken = streamToken; }
    public int getWatchDeadlineHours() { return watchDeadlineHours; }
    public void setWatchDeadlineHours(int watchDeadlineHours) { this.watchDeadlineHours = watchDeadlineHours; }

    @Override public String toString() {
        return "DigitalRental{" + super.toString() + ", watchDeadlineHours=" + watchDeadlineHours + "}";
    }
}
