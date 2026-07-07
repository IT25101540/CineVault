// IT25103608 – Herath H.M.H.S. – Component 04: AI Review Summarizer (SOA REST)
package com.movieplatform.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * AiRestController – Proxies AI Gateway requests to avoid CORS on the frontend.
 * Base URL: /api/ai
 */
@RestController
@RequestMapping("/api/ai")
public class AiRestController {

    @Value("${ai.gateway.url}")
    private String aiGatewayUrl;

    @Value("${ai.gateway.api-key}")
    private String apiKey;

    @Value("${ai.gateway.model:openai/gpt-4o-mini}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * POST /api/ai/summarize
     * Body: { reviews: [ { text: "...", rating: 4 }, ... ] }
     * Returns raw AI JSON (summary, sentiment, sentimentScore, highlights)
     */
    @PostMapping("/summarize")
    public ResponseEntity<Map<String, Object>> summarize(
            @RequestBody Map<String, Object> body) {

        // Build review block string
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> reviews =
                (List<Map<String, Object>>) body.get("reviews");

        if (reviews == null || reviews.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "No reviews provided"));
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < reviews.size(); i++) {
            sb.append("Review ").append(i + 1)
              .append(" (").append(reviews.get(i).get("rating")).append("/5 stars): \"")
              .append(reviews.get(i).get("text")).append("\"\n");
        }

        String prompt = """
You are a helpful movie review analyst.
Analyze the following movie reviews and respond ONLY with a valid JSON object (no markdown, no code block) with these exact keys:
- "summary": a 2-3 sentence overall summary of what viewers think (string)
- "sentiment": one of "POSITIVE", "MIXED", or "NEGATIVE" (string)
- "sentimentScore": a number from 0 to 100 representing positivity (number)
- "highlights": an array of exactly 3 short key points from the reviews (string[])

Reviews to analyze:
""" + sb;

        // Build AI Gateway request
        Map<String, Object> message = Map.of("role", "user", "content", prompt);
        Map<String, Object> aiBody  = new LinkedHashMap<>();
        aiBody.put("model", model);
        aiBody.put("messages", List.of(message));
        aiBody.put("temperature", 0.4);
        aiBody.put("max_tokens", 400);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        try {
            ResponseEntity<Map> aiResponse = restTemplate.exchange(
                    aiGatewayUrl,
                    HttpMethod.POST,
                    new HttpEntity<>(aiBody, headers),
                    Map.class
            );

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> choices =
                    (List<Map<String, Object>>) aiResponse.getBody().get("choices");
            @SuppressWarnings("unchecked")
            Map<String, Object> msg = (Map<String, Object>) choices.get(0).get("message");
            String content = (String) msg.get("content");

            // Parse the JSON string returned by the AI
            com.fasterxml.jackson.databind.ObjectMapper mapper =
                    new com.fasterxml.jackson.databind.ObjectMapper();
            @SuppressWarnings("unchecked")
            Map<String, Object> parsed = mapper.readValue(content.trim(), Map.class);

            return ResponseEntity.ok(parsed);

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "AI service error: " + ex.getMessage()));
        }
    }
}
