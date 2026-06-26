package com.auradev.Backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auradev.Backend.dto.AuthResponse;
import com.auradev.Backend.dto.ForgotPasswordRequest;
import com.auradev.Backend.dto.LoginRequest;
import com.auradev.Backend.dto.ResetPasswordRequest;
import com.auradev.Backend.dto.UserResponse;
import com.auradev.Backend.model.User;
import com.auradev.Backend.service.SessionService;
import com.auradev.Backend.service.UserService;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5174")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private SessionService sessionService;

    @PostMapping("/users/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User createdUser = userService.register(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new UserResponse(createdUser));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(java.util.Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/users/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.login(request.getEmail(), request.getPassword());

        if (user != null) {
            String token = sessionService.createSession(user);
            return ResponseEntity.ok(new AuthResponse(token, new UserResponse(user)));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(java.util.Map.of("message", "Invalid credentials"));
    }

    @GetMapping("/users/me")
    public ResponseEntity<?> currentUser(@RequestHeader(
            value = HttpHeaders.AUTHORIZATION,
            required = false) String authorizationHeader) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "Authorization token is missing"));
        }

        String token = authorizationHeader.substring(7);
        Long userId = sessionService.getUserId(token);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "Invalid or expired session"));
        }

        User user = userService.findById(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("message", "User not found"));
        }

        return ResponseEntity.ok(java.util.Map.of("user", new UserResponse(user)));
    }

    @PostMapping("/users/password/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            String resetToken = userService.generatePasswordResetToken(request);
            return ResponseEntity.ok(java.util.Map.of(
                    "message", "Reset link generated successfully",
                    "resetToken", resetToken
            ));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/users/reset/{token}")
    public ResponseEntity<?> resetPassword(@PathVariable String token,
                                           @RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(token, request);
            return ResponseEntity.ok(java.util.Map.of("message", "Password reset successful"));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(java.util.Map.of("message", ex.getMessage()));
        }
    }
}
