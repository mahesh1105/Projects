package com.fitness.userservice.controller;

import com.fitness.userservice.dto.UserRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.services.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UserController {
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable String id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @GetMapping("/{keycloakId}/validate")
    public ResponseEntity<Boolean> validateUser(@PathVariable String keycloakId) {
        return ResponseEntity.ok(userService.existByKeycloakId(keycloakId));
    }
}
