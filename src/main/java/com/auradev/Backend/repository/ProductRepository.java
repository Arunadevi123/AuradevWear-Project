package com.auradev.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auradev.Backend.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
