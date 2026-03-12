package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityAIService {
    private final GeminiService geminiService;

    public Recommendation generateRecommendation(Activity activity) {
        String prompt = createPromptForActivity(activity);
        String aiResponse = geminiService.getRecommendations(prompt);

        log.info("RESPONSE FROM AI {} ", aiResponse);

        return processAIResponse(activity, aiResponse);
    }

    private String createPromptForActivity(Activity activity) {
        return String.format("""
            Analyze this fitness activity and provide detailed recommendations in the following EXACT JSON format:
            {
              "analysis": {
                "overall": "Overall analysis here",
                "pace": "Pace analysis here",
                "heartRate": "Heart rate analysis here",
                "caloriesBurned": "Calories analysis here"
              },
              "improvements": [
                {
                  "area": "Area name",
                  "recommendation": "Detailed recommendation"
                }
              ],
              "suggestions": [
                {
                  "workout": "Workout name",
                  "description": "Detailed workout description"
                }
              ],
              "safety": [
                "Safety point 1",
                "Safety point 2"
              ]
            }
            
            Analyze this activity:
            Activity Type: %s
            Duration: %d minutes
            Calories Burned: %d
            Additional Metrics: %s
            
            Provide detailed analysis focusing on performance, improvements, next workout suggestions, and safety guidelines.
            Ensure the response follows the EXACT JSON format shown above.
            """,
                activity.getType(),
                activity.getDuration(),
                activity.getCaloriesBurned(),
                activity.getAdditionalMetrics()
        );
    }

    private Recommendation processAIResponse(Activity activity, String aiResponse) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(aiResponse);

            JsonNode textNode = rootNode.path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");

            String jsonContent = textNode.asString()
                    .replaceAll("```json\\n", "")
                    .replaceAll("\\n```", "")
                    .trim();

            log.info("RESPONSE FROM CLEANED AI {} ", jsonContent);

            // Get the Complete JSON Reference
            JsonNode analysisJson = mapper.readTree(jsonContent);

            // Get the Analysis Node Reference
            JsonNode analysisNode = analysisJson.path("analysis");

            // This will store the full analysis for the activity
            StringBuilder fullAnalysis = new StringBuilder();

            List<String> analysisKey = new ArrayList<>(
                List.of("overall", "pace", "heartRate", "caloriesBurned")
            );
            List<String> analysisPrefix = new ArrayList<>(
                    List.of("Overall", "Pace", "Heart Rate", "Calories Burned")
            );

            for(int i=0 ; i<4 ; i++) {
                addAnalysisSection(fullAnalysis, analysisNode, analysisKey.get(i), analysisPrefix.get(i));
            }

            List<String> improvements = extractImprovements(analysisJson.path("improvements"));
            List<String> suggestions = extractSuggestions(analysisJson.path("suggestions"));
            List<String> safety = extractSafetyGuidelines(analysisJson.path("safety"));

            return Recommendation.builder()
                    .activityId(activity.getId())
                    .userId(activity.getUserId())
                    .type(activity.getType())
                    .recommendation(fullAnalysis.toString().trim())
                    .improvements(improvements)
                    .suggestions(suggestions)
                    .safety(safety)
                    .build();
        } catch(Exception e) {
            System.out.println(e.getMessage());
            return createDefaultRecommendation(activity);
        }
    }

    private void addAnalysisSection(StringBuilder fullAnalysis, JsonNode analysisNode, String key, String prefix) {
        if(!analysisNode.path(key).isMissingNode()) {
            fullAnalysis.append(prefix)
                    .append(analysisNode.path(key).asString())
                    .append("\n\n");
        }
    }

    private List<String> extractImprovements(JsonNode improvementsNode) {
        List<String> improvements = new ArrayList<>();

        if(improvementsNode.isArray()) {
            improvementsNode.forEach(improvement -> {
                String area = improvement.path("area").asString();
                String detail = improvement.path("recommendation").asString();
                improvements.add(String.format("%s: %s", area, detail));
            });
        }

        return improvements.isEmpty() ?
                Collections.singletonList("No specific improvements provided") :
                improvements;
    }

    private List<String> extractSuggestions(JsonNode suggestionsNode) {
        List<String> suggestions = new ArrayList<>();

        if(suggestionsNode.isArray()) {
            suggestionsNode.forEach(suggestion -> {
                String workout = suggestion.path("workout").asString();
                String detail = suggestion.path("description").asString();
                suggestions.add(String.format("%s: %s", workout, detail));
            });
        }

        return suggestions.isEmpty() ?
                Collections.singletonList("No specific suggestions provided") :
                suggestions;
    }

    private List<String> extractSafetyGuidelines(JsonNode safetyNode) {
        List<String> safetyGuidelines = new ArrayList<>();

        if(safetyNode.isArray()) {
            safetyNode.forEach(item -> safetyGuidelines.add(item.asString()));
        }

        return safetyGuidelines.isEmpty() ?
                Collections.singletonList("No Safety Guidelines provided") :
                safetyGuidelines;
    }

    private Recommendation createDefaultRecommendation(Activity activity) {
        return Recommendation.builder()
                .activityId(activity.getId())
                .userId(activity.getUserId())
                .type(activity.getType())
                .recommendation("Unable to generate detailed analysis")
                .improvements(Collections.singletonList("Continue with your current routine"))
                .suggestions(Collections.singletonList("Consider consulting a fitness consultant"))
                .safety(Arrays.asList(
                        "Always warm up before exercise",
                        "Stay hydrated",
                        "Listen to your body"
                ))
                .build();
    }
}
