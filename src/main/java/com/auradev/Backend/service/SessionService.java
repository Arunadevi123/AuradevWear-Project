package com.auradev.Backend.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

import com.auradev.Backend.model.User;

@Service
public class SessionService {

    private final Map<String, Long> activeSessions = new ConcurrentHashMap<>();

    public String createSession(User user) {
        String token = UUID.randomUUID().toString();
        activeSessions.put(token, user.getId());
        return token;
    }

    public Long getUserId(String token) {
        return activeSessions.get(token);
    }
}
