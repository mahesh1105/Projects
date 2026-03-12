package com.fitness.aiservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

// This class is responsible for interacting with the Gemini Service

@Service
public class GeminiService {
    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public GeminiService(WebClient webClientBuilder) {
        this.webClient = webClientBuilder;
    }

    public String getRecommendations(String message) {
        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", message)
                        })
                }
        );

        return webClient.post()
                .uri(geminiApiUrl)
                .header("Content-Type", "application/json")
                .header("x-goog-api-key", geminiApiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
