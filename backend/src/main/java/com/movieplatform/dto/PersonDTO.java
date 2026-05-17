// IT25100813 – Luckshidhan K. – Component 06: Director & Cast Management
package com.movieplatform.dto;

public class PersonDTO {
    private String id;
    private String fullName;
    private String nationality;
    private int birthYear;
    private String biography;
    private String photoUrl;
    private String creditType;
    private boolean active;
    // agentContact intentionally excluded from public DTO

    public PersonDTO() {}

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

    @Override public String toString() { return "PersonDTO{id='" + id + "', fullName='" + fullName + "'}"; }
}
