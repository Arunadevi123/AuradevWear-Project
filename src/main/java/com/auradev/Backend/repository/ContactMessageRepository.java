package com.auradev.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auradev.Backend.model.ContactMessage;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}
