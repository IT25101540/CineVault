// IT25103586 – Navishika D.M.N.N. – Component 02: Movie Management
package com.movieplatform.model;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * StreamableMovie – extends Movie (Inheritance).
 * Adds streaming-specific fields.
 */
@Document(collection = "movies")
public class StreamableMovie extends Movie {

    private String streamingUrl;
    private String resolution;       // 1080p | 4K | 720p
    private boolean subtitlesAvailable;

    public StreamableMovie() { super(); }

    public StreamableMovie(String id, String title, String genre, int releaseYear,
                           String synopsis, String posterUrl, String imdbId,
                           String directorId, String streamingUrl, String resolution,
                           boolean subtitlesAvailable) {
        super(id, title, genre, releaseYear, synopsis, posterUrl, imdbId, directorId);
        this.streamingUrl = streamingUrl;
        this.resolution = resolution;
        this.subtitlesAvailable = subtitlesAvailable;
    }

    /** Polymorphism – overrides displayInfo() */
    @Override
    public String displayInfo() {
        return super.displayInfo() + " [Stream: " + resolution + "]";
    }

    public String getStreamingUrl() { return streamingUrl; }
    public void setStreamingUrl(String streamingUrl) { this.streamingUrl = streamingUrl; }
    public String getResolution() { return resolution; }
    public void setResolution(String resolution) { this.resolution = resolution; }
    public boolean isSubtitlesAvailable() { return subtitlesAvailable; }
    public void setSubtitlesAvailable(boolean subtitlesAvailable) { this.subtitlesAvailable = subtitlesAvailable; }

    @Override public String toString() {
        return "StreamableMovie{" + super.toString() + ", resolution='" + resolution + "'}";
    }
}
