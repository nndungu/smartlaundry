package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.model.CartItem;
import ke.co.smartlaundry.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getItems(userId));
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<CartItem> addItem(@PathVariable Long userId,
                                            @RequestParam String itemName,
                                            @RequestParam int quantity,
                                            @RequestParam double price) {
        return ResponseEntity.ok(cartService.addItemToCart(userId, itemName, quantity, price));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
