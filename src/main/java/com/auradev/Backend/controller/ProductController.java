package com.auradev.Backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auradev.Backend.dto.ProductRequest;
import com.auradev.Backend.dto.ProductResponse;
import com.auradev.Backend.dto.ReviewRequest;
import com.auradev.Backend.model.Product;
import com.auradev.Backend.model.User;
import com.auradev.Backend.service.AuthTokenService;
import com.auradev.Backend.service.OrderService;
import com.auradev.Backend.service.ProductService;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    private final AuthTokenService authTokenService;
    private final OrderService orderService;

    public ProductController(ProductService productService, AuthTokenService authTokenService, OrderService orderService) {
        this.productService = productService;
        this.authTokenService = authTokenService;
        this.orderService = orderService;
    }

    @GetMapping("/products")
    public Map<String, Object> products(@RequestParam(defaultValue = "1") int page,
                                        @RequestParam(required = false) String keyword,
                                        @RequestParam(required = false) String category,
                                        @RequestParam(required = false) String sort,
                                        @RequestParam(required = false) String notId,
                                        @RequestParam(defaultValue = "12") int limit) {
        List<Product> filtered = productService.getProducts(keyword, category, sort, notId);
        int start = Math.max(0, (page - 1) * limit);
        int end = Math.min(filtered.size(), start + limit);
        List<ProductResponse> pageItems = filtered.subList(Math.min(start, filtered.size()), end)
                .stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());

        return Map.of(
                "success", true,
                "products", pageItems,
                "total", filtered.size(),
                "totalPages", Math.max(1, (int) Math.ceil((double) filtered.size() / limit))
        );
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<?> product(@PathVariable Long id) {
        Product product = productService.findById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Product not found"));
        }

        return ResponseEntity.ok(Map.of("success", true, "product", new ProductResponse(product)));
    }

    @PostMapping("/product/{id}/reviews")
    public ResponseEntity<?> review(@PathVariable Long id,
                                    @RequestBody ReviewRequest request,
                                    @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        User user = authTokenService.requireUser(authorizationHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Please log in"));
        }

        Product product = productService.findById(id);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Product not found"));
        }

        if (!orderService.hasPurchasedProduct(user.getId(), id)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Purchase required before reviewing"));
        }

        Product updated = productService.addReview(product, request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "review", updated.getReviews().get(updated.getReviews().size() - 1)
        ));
    }

    @PostMapping("/product")
    public ResponseEntity<?> createProduct(@RequestBody ProductRequest request) {
        Product product = productService.saveProduct(request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "product", new ProductResponse(product)
        ));
    }

    @GetMapping("/image/{filename}")
    public ResponseEntity<?> getImage(@PathVariable String filename) {
        // Decode the URL-encoded filename
        String decodedFilename = java.net.URLDecoder.decode(filename, java.nio.charset.StandardCharsets.UTF_8);
        
        // Check if it's a full URL or just a filename
        if (decodedFilename.startsWith("http://") || decodedFilename.startsWith("https://")) {
            // If it's a full URL, redirect to it
            try {
                java.net.URI uri = java.net.URI.create(decodedFilename);
                if (uri != null) {
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .location(uri)
                            .build();
                }
            } catch (IllegalArgumentException | NullPointerException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("success", false, "message", "Invalid URL format"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Invalid URL format"));
        }
        
        // If it's just a filename, try to find it in the uploads folder
        try {
            java.nio.file.Path path = java.nio.file.Paths.get("uploads", decodedFilename);
            if (!java.nio.file.Files.exists(path)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Image not found"));
            }
            String contentType = java.nio.file.Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            byte[] imageData = java.nio.file.Files.readAllBytes(path);
            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                    .body(imageData);
        } catch (java.io.IOException | SecurityException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error loading image"));
        }
    }

    // Get image by name - returns the URL stored in database
    @GetMapping("/image-url/{imageName}")
    public ResponseEntity<?> getImageUrl(@PathVariable String imageName) {
        try {
            // Decode the image name
            String decodedName = java.net.URLDecoder.decode(imageName, java.nio.charset.StandardCharsets.UTF_8);
            
            // If it's already a full URL, return it directly
            if (decodedName.startsWith("http://") || decodedName.startsWith("https://")) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "imageUrl", decodedName
                ));
            }
            
            // Try to find in uploads folder
            java.nio.file.Path path = java.nio.file.Paths.get("uploads", decodedName);
            if (java.nio.file.Files.exists(path)) {
                // Return the local path URL
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "imageUrl", "/api/products/image/" + decodedName
                ));
            }
            
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Image not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error getting image"));
        }
    }

    // View image from product by product ID and image index
    @GetMapping("/view-image/{productId}/{imageIndex}")
    public ResponseEntity<?> viewProductImage(@PathVariable Long productId, @PathVariable int imageIndex) {
        Product product = productService.findById(productId);
        if (product == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Product not found"));
        }
        
        if (product.getImage() == null || product.getImage().isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "No images found"));
        }
        
        if (imageIndex < 0 || imageIndex >= product.getImage().size()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Invalid image index"));
        }
        
        String imageUrl = product.getImage().get(imageIndex).getUrl();
        
        // If it's a full URL, redirect to it
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            try {
                java.net.URI uri = java.net.URI.create(imageUrl);
                if (uri != null) {
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .location(uri)
                            .build();
                }
            } catch (IllegalArgumentException | NullPointerException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("success", false, "message", "Invalid URL format"));
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Invalid URL format"));
        }
        
        // Otherwise serve from local uploads
        try {
            java.nio.file.Path path = java.nio.file.Paths.get("uploads", imageUrl);
            if (!java.nio.file.Files.exists(path)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Image not found"));
            }
            String contentType = java.nio.file.Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            byte[] imageData = java.nio.file.Files.readAllBytes(path);
            return ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(contentType))
                    .body(imageData);
        } catch (java.io.IOException | SecurityException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Error loading image"));
        }
    }
}
