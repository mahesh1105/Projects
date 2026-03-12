package com.fitness.activityService.controller;

import com.fitness.activityService.dto.ActivityRequest;
import com.fitness.activityService.dto.ActivityResponse;
import com.fitness.activityService.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/activities")
public class ActivityController {
    private final ActivityService activityService;

    @PostMapping("/register")
    public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable String id) {
        return ResponseEntity.ok(activityService.getActivity(id));
    }
}
