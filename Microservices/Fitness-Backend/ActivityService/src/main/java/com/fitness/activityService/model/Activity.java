package com.fitness.activityService.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;
import java.util.Map;

// @Builder annotation helps in building the Object in easy way and make it more readable as well

@Document(collection = "activities")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Activity {
    private String id;
    private String userId;
    private ActivityType type;
    private Integer duration;
    private Integer caloriesBurned;
    private LocalDateTime startTime;

    // In Database - Field name should be metrics as we specified with Field annotations
    @Field("metrics")
    private Map<String, Object> additionalMetrics;

    // Generate the TimeStamp automatically on data addition
    @CreatedDate
    private LocalDateTime createdAt;

    // Update the TimeStamp automatically on data update
    @LastModifiedDate
    private LocalDateTime updatedAt;
}
