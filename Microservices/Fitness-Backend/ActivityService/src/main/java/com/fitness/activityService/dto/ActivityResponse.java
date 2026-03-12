package com.fitness.activityService.dto;

import com.fitness.activityService.model.Activity;
import com.fitness.activityService.model.ActivityType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class ActivityResponse {
    private String id;
    private String userId;
    private ActivityType type;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;
    private Map<String, Object> additionalMetrics;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ActivityResponse(Activity activity) {
        this.id = activity.getId();
        this.userId = activity.getUserId();
        this.type = activity.getType();
        this.duration = activity.getDuration();
        this.caloriesBurned = activity.getCaloriesBurned();
        this.startTime = activity.getStartTime();
        this.additionalMetrics = activity.getAdditionalMetrics();
        this.createdAt = activity.getCreatedAt();
        this.updatedAt = activity.getUpdatedAt();
    }
}
