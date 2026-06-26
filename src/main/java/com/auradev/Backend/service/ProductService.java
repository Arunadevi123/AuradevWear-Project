package com.auradev.Backend.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.auradev.Backend.dto.ProductRequest;
import com.auradev.Backend.dto.ReviewRequest;
import com.auradev.Backend.model.Product;
import com.auradev.Backend.model.ProductImage;
import com.auradev.Backend.model.Review;
import com.auradev.Backend.repository.ProductRepository;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getProducts(String keyword, String category, String sort, String notId) {
        List<Product> filtered = productRepository.findAll().stream()
                .filter(product -> keyword == null || keyword.isBlank()
                        || product.getName().toLowerCase(Locale.ENGLISH).contains(keyword.toLowerCase(Locale.ENGLISH))
                        || (product.getDescription() != null && product.getDescription().toLowerCase(Locale.ENGLISH)
                        .contains(keyword.toLowerCase(Locale.ENGLISH))))
                .filter(product -> category == null || category.isBlank() || "All".equalsIgnoreCase(category)
                        || product.getCategory().equalsIgnoreCase(category))
                .filter(product -> notId == null || notId.isBlank()
                        || !String.valueOf(product.getId()).equals(notId))
                .collect(Collectors.toList());

        if ("price-low".equalsIgnoreCase(sort)) {
            filtered.sort(Comparator.comparing(Product::getPrice));
        } else if ("price-high".equalsIgnoreCase(sort)) {
            filtered.sort(Comparator.comparing(Product::getPrice).reversed());
        } else if ("ratings".equalsIgnoreCase(sort)) {
            filtered.sort(Comparator.comparing(Product::getRatings).reversed());
        }

        return filtered;
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product addReview(Product product, ReviewRequest request) {
        Review review = new Review();
        review.setName(request.getName());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());
        product.getReviews().add(review);
        product.setNumberOfReviews(product.getReviews().size());
        product.setRatings(product.getReviews().stream().mapToInt(Review::getRating).average().orElse(0.0));
        return productRepository.save(product);
    }

    public Product saveProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setColor(request.getColor());
        product.setMaterial(request.getMaterial());
        product.setType(request.getType());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setRatings(0.0);
        product.setNumberOfReviews(0);

        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<ProductImage> images = request.getImages().stream()
                    .map(url -> {
                        // If it's a full URL, store as is; otherwise prepend path
                        String imageUrl = url;
                        if (!url.startsWith("http://") && !url.startsWith("https://")) {
                            imageUrl = "/api/products/image/" + url;
                        }
                        return new ProductImage(imageUrl);
                    })
                    .collect(Collectors.toList());
            product.setImage(images);
        }

        return productRepository.save(product);
    }
}
