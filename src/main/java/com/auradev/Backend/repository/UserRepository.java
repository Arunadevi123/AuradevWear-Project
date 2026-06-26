package com.auradev.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auradev.Backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    boolean existsByEmail(String email);

    User findByPasswordResetToken(String passwordResetToken);
}
