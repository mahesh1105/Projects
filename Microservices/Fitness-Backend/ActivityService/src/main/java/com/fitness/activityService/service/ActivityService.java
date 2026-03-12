package com.fitness.activityService.service;

import com.fitness.activityService.dto.ActivityRequest;
import com.fitness.activityService.dto.ActivityResponse;
import com.fitness.activityService.model.Activity;
import com.fitness.activityService.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final KafkaTemplate<String, Activity> kafkaTemplate;

    @Value("${kafka.topic.name}")
    private String topicName;

    public ActivityResponse trackActivity(ActivityRequest request) {
        Boolean isValidUser = userValidationService.validateUser(request.getUserId());
        System.out.println(request.getUserId());

        if(!isValidUser) {
            throw new RuntimeException("Invalid UserId: " + request.getUserId());
        }

        // Creating the Activity Object - Builder Design Pattern
        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        // Save the Object in DB
        Activity savedActivity = activityRepository.save(activity);

        try {
            // Send the saved activity to Kafka
            kafkaTemplate.send(topicName, savedActivity.getUserId(), savedActivity);
        } catch(Exception e) {
            System.out.println(e.getMessage());
        }

        return new ActivityResponse(savedActivity);
    }

    public ActivityResponse getActivity(String id) {
        Activity activity = activityRepository.findById(id).orElseThrow(() -> new RuntimeException("Activity doesn't exists"));
        return new ActivityResponse(activity);
    }
}
