package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.AddCartItemRequestDTO;
import ke.co.smartlaundry.dto.CartItemDTO;
import ke.co.smartlaundry.model.CartItem;
import ke.co.smartlaundry.security.SecurityUtils;
import ke.co.smartlaundry.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCartItems() {
        Long userId = SecurityUtils.getCurrentUserId();
        List<CartItemDTO> items = cartService.getItems(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(items);
    }

    @PostMapping("/add")
    public ResponseEntity<CartItemDTO> addItem(@Valid @RequestBody AddCartItemRequestDTO request) {
        Long userId = SecurityUtils.getCurrentUserId();
        CartItem item = cartService.addItemToCart(
                userId,
                request.getItemName(),
                request.getQuantity(),
                request.getPrice(),
                request.getCategoryId()
        );
        return ResponseEntity.ok(mapToDTO(item));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        Long userId = SecurityUtils.getCurrentUserId();
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    private CartItemDTO mapToDTO(CartItem item) {
        return new CartItemDTO(
                item.getId(),
                item.getItemName(),
                item.getQuantity(),
                item.getPrice(),
                item.getCategory() != null ? item.getCategory().getName() : null
        );
    }
}
