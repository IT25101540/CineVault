// IT25103586 – Navishika D.M.N.N. – Component 02: Movie Management
package com.movieplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Movie – base entity. imdbId is final (Encapsulation).
 * StreamableMovie and PhysicalDisc extend this (Inheritance).
 */
@Document(collection = "movies")
public class Movie {

    @Id
    private String id;
    private String title;
    private String genre;
    private int releaseYear;
    private String synopsis;
    private String posterUrl;
    private String imdbId;   // removed final to fix MongoDB mapping
    private String trailerUrl;
    private double averageRating;
    private String directorId;
    private List<String> actorIds = new ArrayList<>();
    private boolean available;

    public Movie() {}

    public Movie(String id, String title, String genre, int releaseYear,
                 String synopsis, String posterUrl, String imdbId, String directorId) {
        this.id = id;
        this.title = title;
        this.genre = genre;
        this.releaseYear = releaseYear;
        this.synopsis = synopsis;
        this.posterUrl = posterUrl;
        this.imdbId = imdbId;
        this.directorId = directorId;
        this.actorIds = new ArrayList<>();
        this.averageRating = 0.0;
        this.available = true;
    }

    /** Polymorphism hook */
    public String displayInfo() {
        return title + " (" + releaseYear + ") – " + genre;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
    public int getReleaseYear() { return releaseYear; }
    public void setReleaseYear(int releaseYear) { this.releaseYear = releaseYear; }
    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }
    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }
    public String getTrailerUrl() { return trailerUrl; }
    public void setTrailerUrl(String trailerUrl) { this.trailerUrl = trailerUrl; }
    public String getImdbId() { return imdbId; }
    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }
    public String getDirectorId() { return directorId; }
    public void setDirectorId(String directorId) { this.directorId = directorId; }
    public List<String> getActorIds() { return actorIds; }
    public void setActorIds(List<String> actorIds) { this.actorIds = actorIds; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    @Override
    public String toString() {
        return "Movie{id='" + id + "', title='" + title + "', genre='" + genre +
               "', releaseYear=" + releaseYear + ", imdbId='" + imdbId + "'}";
    }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Movie m)) return false;
        return Objects.equals(id, m.id);
    }

    @Override public int hashCode() { return Objects.hash(id); }
}
