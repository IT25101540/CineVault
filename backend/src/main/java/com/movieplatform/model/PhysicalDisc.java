// IT25103586 – Navishika D.M.N.N. – Component 02: Movie Management
package com.movieplatform.model;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * PhysicalDisc – extends Movie (Inheritance).
 * Adds physical media fields.
 */
@Document(collection = "movies")
public class PhysicalDisc extends Movie {

    private String discType;       // DVD | BLU_RAY
    private int copiesAvailable;

    public PhysicalDisc() { super(); }

    public PhysicalDisc(String id, String title, String genre, int releaseYear,
                        String synopsis, String posterUrl, String imdbId,
                        String directorId, String discType, int copiesAvailable) {
        super(id, title, genre, releaseYear, synopsis, posterUrl, imdbId, directorId);
        this.discType = discType;
        this.copiesAvailable = copiesAvailable;
    }

    /** Polymorphism – overrides displayInfo() */
    @Override
    public String displayInfo() {
        return super.displayInfo() + " [" + discType + ", Copies: " + copiesAvailable + "]";
    }

    public String getDiscType() { return discType; }
    public void setDiscType(String discType) { this.discType = discType; }
    public int getCopiesAvailable() { return copiesAvailable; }
    public void setCopiesAvailable(int copiesAvailable) { this.copiesAvailable = copiesAvailable; }

    @Override public String toString() {
        return "PhysicalDisc{" + super.toString() + ", discType='" + discType +
               "', copiesAvailable=" + copiesAvailable + "}";
    }
}
