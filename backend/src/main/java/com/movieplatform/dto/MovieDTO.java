// IT25103586 – Navishika D.M.N.N. – Component 02: Movie Management
package com.movieplatform.dto;

import java.util.List;

public class MovieDTO {
    private String id;
    private String title;
    private String genre;
    private int releaseYear;
    private String synopsis;
    private String posterUrl;
    private String trailerUrl;
    private double averageRating;
    private String directorId;
    private List<String> actorIds;
    private boolean available;
    private String type; // STREAMABLE | PHYSICAL

    public MovieDTO() {}

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
    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }
    public String getDirectorId() { return directorId; }
    public void setDirectorId(String directorId) { this.directorId = directorId; }
    public List<String> getActorIds() { return actorIds; }
    public void setActorIds(List<String> actorIds) { this.actorIds = actorIds; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    @Override public String toString() {
        return "MovieDTO{id='" + id + "', title='" + title + "'}";
    }
}
