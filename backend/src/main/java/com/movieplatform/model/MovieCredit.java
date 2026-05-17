// IT25100813 – Luckshidhan K. – Component 06: Director & Cast Management
package com.movieplatform.model;

import java.util.Objects;

/** MovieCredit – junction record linking a person to a movie with a role. */
public class MovieCredit {
    private String personId;
    private String movieId;
    private String role;   // DIRECTOR | ACTOR | PRODUCER

    public MovieCredit() {}

    public MovieCredit(String personId, String movieId, String role) {
        this.personId = personId;
        this.movieId = movieId;
        this.role = role;
    }

    public String getPersonId() { return personId; }
    public void setPersonId(String personId) { this.personId = personId; }
    public String getMovieId() { return movieId; }
    public void setMovieId(String movieId) { this.movieId = movieId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    @Override public String toString() {
        return "MovieCredit{personId='" + personId + "', movieId='" + movieId + "', role='" + role + "'}";
    }
    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MovieCredit mc)) return false;
        return Objects.equals(personId, mc.personId) && Objects.equals(movieId, mc.movieId);
    }
    @Override public int hashCode() { return Objects.hash(personId, movieId); }
}
