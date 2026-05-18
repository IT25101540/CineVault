// IT25103608 – Herath H.M.H.S. – Component 04: Rental Management
package com.movieplatform.model;

import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

/** PhysicalRental – extends RentalTransaction (Inheritance). */
@Document(collection = "rentals")
public class PhysicalRental extends RentalTransaction {

    private String deliveryAddress;
    private String discType;   // DVD | BLU_RAY

    public PhysicalRental() { super(); }

    public PhysicalRental(String id, String userId, String movieId,
                           LocalDate rentalDate, LocalDate dueDate,
                           String deliveryAddress, String discType) {
        super(id, userId, movieId, rentalDate, dueDate);
        this.deliveryAddress = deliveryAddress;
        this.discType = discType;
    }

    /** Polymorphism – physical charges $1.50/day */
    @Override
    public double calculateLateFee() {
        if (getReturnedDate() == null || !getReturnedDate().isAfter(getDueDate())) return 0.0;
        long days = (long) java.time.temporal.ChronoUnit.DAYS.between(getDueDate(), getReturnedDate());
        return days * 1.50;
    }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }
    public String getDiscType() { return discType; }
    public void setDiscType(String discType) { this.discType = discType; }

    @Override public String toString() {
        return "PhysicalRental{" + super.toString() + ", discType='" + discType + "'}";
    }
}
