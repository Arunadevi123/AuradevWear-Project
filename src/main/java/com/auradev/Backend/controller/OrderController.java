package com.auradev.Backend.controller;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auradev.Backend.model.Order;
import com.auradev.Backend.model.User;
import com.auradev.Backend.service.AuthTokenService;
import com.auradev.Backend.service.OrderService;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    private final AuthTokenService authTokenService;

    public OrderController(OrderService orderService, AuthTokenService authTokenService) {
        this.orderService = orderService;
        this.authTokenService = authTokenService;
    }

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order,
                                         @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        User user = authTokenService.requireUser(authorizationHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in"));
        }

        String validationError = validateOrder(order);
        if (validationError != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", validationError));
        }

        try {
            order.setUserId(user.getId());
            Order created = orderService.createOrder(order);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("success", true, "order", toOrderResponse(created)));
        } catch (RuntimeException exception) {
            logger.error("Unable to place order", exception);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", getOrderErrorMessage(exception)));
        }
    }

    @GetMapping("/myorders")
    public ResponseEntity<?> myOrders(@RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        User user = authTokenService.requireUser(authorizationHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Please log in"));
        }

        List<Map<String, Object>> orders = orderService.getOrdersForUser(user.getId()).stream()
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("orders", orders));
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<?> markPaid(@PathVariable Long id,
                                      @RequestBody Map<String, Object> payload,
                                      @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        User user = authTokenService.requireUser(authorizationHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Please log in"));
        }

        Order order = orderService.findById(id);
        if (order == null || !order.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
        }

        order.setPaid(true);
        order.setPaidAt(LocalDateTime.now());
        order.setPaymentId(String.valueOf(payload.getOrDefault("paymentId", "manual-payment")));
        orderService.save(order);
        return ResponseEntity.ok(Map.of("success", true, "order", toOrderResponse(order)));
    }

    @PutMapping("/{id}/deliver")
    public ResponseEntity<?> markDelivered(@PathVariable Long id,
                                           @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        User user = authTokenService.requireUser(authorizationHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Please log in"));
        }

        Order order = orderService.findById(id);
        if (order == null || !order.getUserId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Order not found"));
        }

        order.setDelivered(true);
        order.setDeliveredAt(LocalDateTime.now());
        orderService.save(order);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @GetMapping("/check-product-purchase/{productId}")
    public ResponseEntity<?> hasPurchased(@PathVariable Long productId,
                                          @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        User user = authTokenService.requireUser(authorizationHeader);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false));
        }

        return ResponseEntity.ok(Map.of("success", orderService.hasPurchasedProduct(user.getId(), productId)));
    }

    private Map<String, Object> toOrderResponse(Order order) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("_id", String.valueOf(order.getId()));
        response.put("id", order.getId());
        response.put("orderItems", order.getOrderItems().stream()
                .map(item -> {
                    Map<String, Object> itemResponse = new LinkedHashMap<>();
                    itemResponse.put("product", item.getProduct());
                    itemResponse.put("name", item.getName());
                    itemResponse.put("qty", item.getQty());
                    itemResponse.put("image", item.getImage());
                    itemResponse.put("price", item.getPrice());
                    return itemResponse;
                })
                .collect(Collectors.toList()));
        response.put("shippingAddress", Map.of(
                "address", order.getShippingAddress().getAddress(),
                "city", order.getShippingAddress().getCity(),
                "state", order.getShippingAddress().getState(),
                "postalCode", order.getShippingAddress().getPostalCode(),
                "country", order.getShippingAddress().getCountry()));
        response.put("paymentMethod", order.getPaymentMethod());
        response.put("itemsPrice", order.getItemsPrice());
        response.put("taxPrice", order.getTaxPrice());
        response.put("shippingPrice", order.getShippingPrice());
        response.put("totalPrice", order.getTotalPrice());
        response.put("isPaid", order.isPaid());
        response.put("isDelivered", order.isDelivered());
        response.put("createdAt", order.getCreatedAt());
        return response;
    }

    private String validateOrder(Order order) {
        if (order == null) {
            return "Order details are required";
        }
        if (order.getOrderItems() == null || order.getOrderItems().isEmpty()) {
            return "Your cart is empty";
        }
        if (order.getShippingAddress() == null
                || isBlank(order.getShippingAddress().getAddress())
                || isBlank(order.getShippingAddress().getCity())
                || isBlank(order.getShippingAddress().getState())
                || isBlank(order.getShippingAddress().getPostalCode())
                || isBlank(order.getShippingAddress().getCountry())) {
            return "Please enter a complete shipping address";
        }
        if (isBlank(order.getPaymentMethod())) {
            return "Please select a payment method";
        }
        if (order.getTotalPrice() == null || order.getTotalPrice().signum() <= 0) {
            return "Order total must be greater than zero";
        }
        boolean hasInvalidItem = order.getOrderItems().stream()
                .anyMatch(item -> item.getProduct() == null
                        || isBlank(item.getName())
                        || item.getQty() <= 0
                        || item.getPrice() == null
                        || item.getPrice().signum() < 0);
        if (hasInvalidItem) {
            return "Invalid product in cart. Please remove it and add it again.";
        }
        return null;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String getOrderErrorMessage(RuntimeException exception) {
        String message = exception.getMessage();
        if (message == null || message.isBlank()) {
            return "Unable to place order. Please try again.";
        }
        return "Unable to place order: " + message;
    }
}
