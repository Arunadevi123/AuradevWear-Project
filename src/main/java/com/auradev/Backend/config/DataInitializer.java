package com.auradev.Backend.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.context.annotation.Configuration;

import com.auradev.Backend.model.Product;
import com.auradev.Backend.model.ProductImage;

@Configuration
public class DataInitializer {


    @SuppressWarnings("unused")
    private Product product(String name, String category, String description, String color,
                            String material, String type, String imageUrl, BigDecimal price, int stock) {
        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setDescription(description);
        product.setColor(color);
        product.setMaterial(material);
        product.setType(type);
        product.setPrice(price);
        product.setStock(stock);
        product.setRatings(4.5);
        product.setNumberOfReviews(0);
        product.setImage(List.of(new ProductImage(imageUrl)));
        return product;
    }
}
