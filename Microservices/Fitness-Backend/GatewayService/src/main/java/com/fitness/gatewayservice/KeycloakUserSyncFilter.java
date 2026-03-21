package com.fitness.gatewayservice;

import com.fitness.gatewayservice.user.UserRequest;
import com.fitness.gatewayservice.user.UserService;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NullMarked;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

// @RequiredArgsConstructor helps in auto-injecting the final field

@Component
@Slf4j
@RequiredArgsConstructor
public class KeycloakUserSyncFilter implements WebFilter {
    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        // We can get the request from the exchange

        // Extract the userId and token from the request headers
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");

        UserRequest registerRequest = getUserDetails(token);

        if(userId == null) {
            userId = registerRequest.getKeycloakId();
        }

        if(userId != null && token != null) {
            String finalUserId = userId;
            return userService.validateUser(userId)
                    .flatMap(exist -> {
                        if(!exist) {
                            // Register User
                            if(registerRequest != null) {
                                return userService.registerUser(registerRequest)
                                        .then(Mono.empty());
                            } else {
                                return Mono.empty();
                            }
                        } else {
                            log.info("User already exist, Skipping sync");
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> { // defer is used to change the request
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-ID", finalUserId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }
        return chain.filter(exchange);
    }

    // Get User details from the Token
    private UserRequest getUserDetails(String token) {
        // Token Format: Bearer<Token>
        try {
            // Replace Bearer word from the token with empty String
            String tokenWithoutBearer = token.replace("Bearer", "").trim();

            SignedJWT signedJWT = SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            UserRequest request = new UserRequest();
            request.setEmail(claims.getStringClaim("email"));
            request.setKeycloakId(claims.getStringClaim("sub"));
            request.setFirstName(claims.getStringClaim("given_name"));
            request.setLastName(claims.getStringClaim("family_name"));
            request.setPassword("dummy@123123");

            return request;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
