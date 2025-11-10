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
        testUser = userRepository.findByEmail("test1@example.com")
                .orElseThrow(() -> new IllegalStateException("Test user not found"));
        testUserId = testUser.getId();
    }

    @Test
    @DisplayName("GET /api/cart should return all cart items for the user")
    void getCartItems_returnsCartItems() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUserId);

            Cart cart = cartRepository.findByUserId(testUserId)
                    .orElseThrow(() -> new IllegalStateException("Cart not found"));

            List<String> expectedItemNames = cart.getItems().stream()
                    .map(CartItem::getItemName)
                    .collect(Collectors.toList());

            mockMvc.perform(get("/api/cart"))
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
    @DisplayName("POST /api/cart/add should add a new item to the cart")
    void addItem_addsItemToCart() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUserId);

            mockMvc.perform(post("/api/cart/add")
                            .param("itemName", "Jacket")
                            .param("quantity", "2")
                            .param("price", "500"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.itemName").value("Jacket"))
                    .andExpect(jsonPath("$.quantity").value(2))
                    .andExpect(jsonPath("$.price").value(500.0));

            // Verify persisted in DB
            Cart cart = cartRepository.findByUserId(testUserId)
                    .orElseThrow(() -> new IllegalStateException("Cart not found"));
            assertThat(cart.getItems().stream()
                    .anyMatch(i -> i.getItemName().equals("Jacket") && i.getQuantity() == 2))
                    .isTrue();
        }
    }

    @Test
    @DisplayName("DELETE /api/cart/item/{itemId} should remove the item from cart")
    void removeItem_removesItem() throws Exception {
        Cart cart = cartRepository.findByUserId(testUserId)
                .orElseThrow(() -> new IllegalStateException("Cart not found"));

        CartItem item = cart.getItems().get(0);

        mockMvc.perform(delete("/api/cart/item/{itemId}", item.getId()))
                .andExpect(status().isNoContent());

        Cart updatedCart = cartRepository.findByUserId(testUserId)
                .orElseThrow(() -> new IllegalStateException("Cart not found"));
        assertThat(updatedCart.getItems().stream().noneMatch(i -> i.getId().equals(item.getId()))).isTrue();
    }

    @Test
    @DisplayName("DELETE /api/cart/clear should remove all items from cart")
    void clearCart_clearsCart() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUserId);

            mockMvc.perform(delete("/api/cart/clear"))
                    .andExpect(status().isNoContent());

            Cart cart = cartRepository.findByUserId(testUserId)
                    .orElseThrow(() -> new IllegalStateException("Cart not found"));
            assertThat(cart.getItems()).isEmpty();
        }
    }
}
