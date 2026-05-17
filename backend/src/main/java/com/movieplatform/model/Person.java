// IT25100813 – Luckshidhan K. – Component 06: Director & Cast Management
package com.movieplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Objects;

/**
 * Person – base entity for directors and cast members.
 */
@Document(collection = "people")
public class Person {
    @Id
    private String id;
    private String fullName;
    private String nationality;
    private int birthYear;
    private String biography;
    private String photoUrl;
    private String creditType;   // DIRECTOR | ACTOR | BOTH
    private boolean active = true;

    public Person() {}

    public Person(String id, String fullName, String nationality, int birthYear,
                  String biography, String photoUrl, String creditType) {
        this.id = id;
        this.fullName = fullName;
        this.nationality = nationality;
        this.birthYear = birthYear;
        this.biography = biography;
        this.photoUrl = photoUrl;
        this.creditType = creditType;
        this.active = true;
    }

    /** Polymorphism hook */
    public String displayCredit() { return fullName; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getNationality() { return nationality; }
    public void setNationality(String nationality) { this.nationality = nationality; }
    public int getBirthYear() { return birthYear; }
    public void setBirthYear(int birthYear) { this.birthYear = birthYear; }
    public String getBiography() { return biography; }
    public void setBiography(String biography) { this.biography = biography; }
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }
    public String getCreditType() { return creditType; }
    public void setCreditType(String creditType) { this.creditType = creditType; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    @Override public String toString() {
        return "Person{id='" + id + "', fullName='" + fullName + "', creditType='" + creditType + "'}";
    }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Person p)) return false;
        return Objects.equals(id, p.id);
    }
    @Override public int hashCode() { return Objects.hash(id); }
}
