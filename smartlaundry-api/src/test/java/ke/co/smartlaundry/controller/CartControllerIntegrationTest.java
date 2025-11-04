package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.model.Cart;
import ke.co.smartlaundry.model.CartItem;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.CartRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.security.SecurityUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mockStatic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CartControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    private User testUser;
    private Long testUserId;

    @BeforeEach
    void setup() {
        // Use seeded user from test-data.sql
        testUser = userRepository.findByEmail("customer1@example.com")
                .orElseThrow(() -> new IllegalStateException("Test user not found"));
        testUserId = testUser.getId();
    }

    @Test
    @DisplayName("GET /api/carts should return all cart items for user")
    void getCartItems_returnsCartItems() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUserId);

            List<String> expectedItemNames = cartRepository.findByUserId(testUserId).stream()
                    .flatMap(c -> c.getItems().stream())
                    .map(CartItem::getItemName)
                    .collect(Collectors.toList());

            mockMvc.perform(get("/api/carts"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(expectedItemNames.size()))
                    .andExpect(result -> {
                        String json = result.getResponse().getContentAsString();
                        for (String itemName : expectedItemNames) {
                            assertThat(json).contains(itemName);
                        }
                    });
        }
    }

    @Test
    @DisplayName("POST /api/carts/add should add a new item")
    void addItem_addsItemToCart() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUserId);

            mockMvc.perform(post("/api/carts/add")
                            .param("itemName", "Jacket")
                            .param("quantity", "2")
                            .param("price", "500"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.itemName").value("Jacket"))
                    .andExpect(jsonPath("$.quantity").value(2));

            // Verify persisted
            Cart cart = cartRepository.findByUserId(testUserId).get();
            assertThat(cart.getItems().stream().anyMatch(i -> i.getItemName().equals("Jacket"))).isTrue();
        }
    }

    @Test
    @DisplayName("DELETE /api/carts/item/{id} should remove an item")
    void removeItem_removesItem() throws Exception {
        CartItem item = cartRepository.findByUserId(testUserId).get().getItems().get(0);

        mockMvc.perform(delete("/api/carts/item/{itemId}", item.getId()))
                .andExpect(status().isNoContent());

        Cart cart = cartRepository.findByUserId(testUserId).get();
        assertThat(cart.getItems().stream().noneMatch(i -> i.getId().equals(item.getId()))).isTrue();
    }

    @Test
    @DisplayName("DELETE /api/carts/clear should clear all items")
    void clearCart_clearsCart() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUserId);

            mockMvc.perform(delete("/api/carts/clear"))
                    .andExpect(status().isNoContent());

            List<CartItem> items = cartRepository.findByUserId(testUserId).stream()
                    .flatMap(c -> c.getItems().stream())
                    .collect(Collectors.toList());
            assertThat(items).isEmpty();
        }
    }
}
