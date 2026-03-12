package com.fitness.userservice.services;

import com.fitness.userservice.dto.UserRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.models.User;
import com.fitness.userservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    public UserResponse register(UserRequest request) {
        // Check if the email already exists - Return existing user
        if(userRepository.existsByEmail(request.getEmail())) {
            User existingUser = userRepository.findByEmail(request.getEmail());

            return UserResponse.builder()
                    .id(existingUser.getId())
                    .email(existingUser.getEmail())
                    .keycloakId(existingUser.getKeycloakId())
                    .password(existingUser.getPassword())
                    .firstName(existingUser.getFirstName())
                    .lastName(existingUser.getLastName())
                    .createdAt(existingUser.getCreatedAt())
                    .updatedAt(existingUser.getUpdatedAt())
                    .build();
        }

        // Create the User Object - Builder Design Pattern
        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .keycloakId(request.getKeycloakId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();

        // Save the user in DB and it will return the saved user info
        User savedUser = userRepository.save(user);

        return UserResponse.builder()
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .keycloakId(savedUser.getKeycloakId())
                .password(savedUser.getPassword())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .createdAt(savedUser.getCreatedAt())
                .updatedAt(savedUser.getUpdatedAt())
                .build();
    }

    public UserResponse getUserProfile(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User Not Found"));

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .keycloakId(user.getKeycloakId())
                .password(user.getPassword())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public Boolean existByKeycloakId(String id) {
        log.info("Calling User Service for {}", id);
        return userRepository.existsByKeycloakId(id);
    }
}
