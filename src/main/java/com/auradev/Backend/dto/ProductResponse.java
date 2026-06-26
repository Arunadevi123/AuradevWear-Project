package com.auradev.Backend.dto;

import java.math.BigDecimal;
import java.util.List;

import com.auradev.Backend.model.Product;
import com.auradev.Backend.model.ProductImage;
import com.auradev.Backend.model.Review;

public class ProductResponse {

    private final String _id;
    private final Long id;
    private final String name;
    private final String description;
    private final String category;
    private final String color;
    private final String material;
    private final String type;
    private final BigDecimal price;
    private final int stock;
    private final double ratings;
    private final int numberOfReviews;
    private final List<ProductImage> image;
    private final List<Review> reviews;

    public ProductResponse(Product product) {
        this._id = String.valueOf(product.getId());
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.category = product.getCategory();
        this.color = product.getColor();
        this.material = product.getMaterial();
        this.type = product.getType();
        this.price = product.getPrice();
        this.stock = product.getStock();
        this.ratings = product.getRatings();
        this.numberOfReviews = product.getNumberOfReviews();
        this.image = product.getImage();
        this.reviews = product.getReviews();
    }

    public String get_id() {
        return _id;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getColor() {
        return color;
    }

    public String getMaterial() {
        return material;
    }

    public String getType() {
        return type;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getStock() {
        return stock;
    }

    public double getRatings() {
        return ratings;
    }

    public int getNumberOfReviews() {
        return numberOfReviews;
    }

    public List<ProductImage> getImage() {
        return image;
    }

    public List<Review> getReviews() {
        return reviews;
    }
}
