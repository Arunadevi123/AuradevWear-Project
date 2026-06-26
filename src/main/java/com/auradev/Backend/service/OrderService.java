package com.auradev.Backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.auradev.Backend.model.Order;
import com.auradev.Backend.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order createOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public List<Order> getOrdersForUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order findById(Long id) {
        return orderRepository.findById(id).orElse(null);
    }

    public Order save(Order order) {
        return orderRepository.save(order);
    }

    public boolean hasPurchasedProduct(Long userId, Long productId) {
        return getOrdersForUser(userId).stream()
                .flatMap(order -> order.getOrderItems().stream())
                .anyMatch(item -> productId.equals(item.getProduct()));
    }
}
