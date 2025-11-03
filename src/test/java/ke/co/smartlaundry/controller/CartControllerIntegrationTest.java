package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.model.CartItem;
import ke.co.smartlaundry.service.CartService;
import ke.co.smartlaundry.security.SecurityUtils;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.mockStatic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CartControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CartService cartService;

    private final Long testUserId = 3L; // customer1 from test-data.sql

    @Test
    @DisplayName("GET /api/carts should return cart items")
    void getCartItems_returnsCartItems() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUserId);

            mockMvc.perform(get("/api/carts"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.length()").value(3))
                    .andExpect(jsonPath("$[0].itemName").value("Shirt"))
                    .andExpect(jsonPath("$[1].itemName").value("Trouser"))
                    .andExpect(jsonPath("$[2].itemName").value("Duvet"));
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
        }
    }

    @Test
    @DisplayName("DELETE /api/carts/item/{id} should remove an item")
    void removeItem_removesItem() throws Exception {
        // get first cart item
        CartItem item = cartService.getItems(testUserId).getFirst();

        mockMvc.perform(delete("/api/carts/item/{itemId}", item.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    @DisplayName("DELETE /api/carts/clear should clear all items")
    void clearCart_clearsCart() throws Exception {
        try (MockedStatic<SecurityUtils> utilities = mockStatic(SecurityUtils.class)) {
            utilities.when(SecurityUtils::getCurrentUserId).thenReturn(testUserId);

            mockMvc.perform(delete("/api/carts/clear"))
                    .andExpect(status().isNoContent());

            List<CartItem> items = cartService.getItems(testUserId);
            assert items.isEmpty();
        }
    }
}
