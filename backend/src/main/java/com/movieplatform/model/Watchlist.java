package com.movieplatform.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Data
@Document(collection = "watchlists")
public class Watchlist {
    @Id
    private String id;
    private String userId;
    private List<String> movieIds = new ArrayList<>();
}
