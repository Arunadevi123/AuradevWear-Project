package com.auradev.Backend;

import static org.assertj.core.api.Assertions.assertThat;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.auradev.Backend.model.Order;
import com.auradev.Backend.model.OrderItem;
import com.auradev.Backend.model.Product;
import com.auradev.Backend.model.ShippingAddress;
import com.auradev.Backend.model.User;
import com.auradev.Backend.repository.OrderRepository;
import com.auradev.Backend.repository.ProductRepository;
import com.auradev.Backend.repository.UserRepository;

@SpringBootTest
@Transactional
class OrderRepositoryMappingTests {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void savesOrderItemsWithProductIdColumn() {
        User user = new User("Order Test", "order-test@example.com", "password");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("Order Mapping Product");
        product.setPrice(BigDecimal.valueOf(1499));
        product.setStock(5);
        product = productRepository.save(product);

        OrderItem item = new OrderItem();
        item.setProduct(product.getId());
        item.setName(product.getName());
        item.setQty(1);
        item.setImage("/placeholder.jpg");
        item.setPrice(product.getPrice());

        ShippingAddress address = new ShippingAddress();
        address.setAddress("123 Street");
        address.setCity("Theni");
        address.setState("Tamil Nadu");
        address.setPostalCode("625520");
        address.setCountry("India");

        Order order = new Order();
        order.setUserId(user.getId());
        order.setPaymentMethod("Cash on Delivery");
        order.setShippingAddress(address);
        order.setItemsPrice(product.getPrice());
        order.setTaxPrice(BigDecimal.ZERO);
        order.setShippingPrice(BigDecimal.ZERO);
        order.setTotalPrice(product.getPrice());
        order.setOrderItems(List.of(item));

        Order saved = orderRepository.saveAndFlush(order);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getOrderItems()).hasSize(1);
        assertThat(saved.getOrderItems().get(0).getProduct()).isEqualTo(product.getId());
    }
}
