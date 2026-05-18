package com.movieplatform.controller;

import com.movieplatform.model.Watchlist;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/watchlist")
@CrossOrigin(origins = "*")
public class WatchlistRestController {

    @GetMapping("/{userId}")
    public Watchlist getWatchlist(@PathVariable String userId) {
        // Placeholder implementation
        Watchlist w = new Watchlist();
        w.setUserId(userId);
        w.setMovieIds(new ArrayList<>());
        return w;
    }

    @PostMapping("/{userId}/add/{movieId}")
    public Watchlist addToWatchlist(@PathVariable String userId, @PathVariable String movieId) {
        // Placeholder implementation
        return new Watchlist();
    }
}
