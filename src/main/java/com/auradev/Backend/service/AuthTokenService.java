package com.auradev.Backend.service;

import org.springframework.stereotype.Service;

import com.auradev.Backend.model.User;

@Service
public class AuthTokenService {

    private final SessionService sessionService;
    private final UserService userService;

    public AuthTokenService(SessionService sessionService, UserService userService) {
        this.sessionService = sessionService;
        this.userService = userService;
    }

    public User requireUser(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authorizationHeader.substring(7);
        Long userId = sessionService.getUserId(token);
        if (userId == null) {
            return null;
        }

        return userService.findById(userId);
    }
}
