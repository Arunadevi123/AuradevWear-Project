package com.auradev.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auradev.Backend.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
}
