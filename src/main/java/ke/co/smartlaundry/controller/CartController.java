package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.CartItemDTO;
import ke.co.smartlaundry.model.CartItem;
import ke.co.smartlaundry.service.CartService;
import ke.co.smartlaundry.security.SecurityUtils;
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

    @GetMapping
public ResponseEntity<List<CartItemDTO>> getCartItems() {
    Long userId = SecurityUtils.getCurrentUserId();
    List<CartItemDTO> items = cartService.getItems(userId).stream()
        .map(i -> new CartItemDTO(i.getId(), i.getItemName(), i.getQuantity(), i.getPrice()))
        .toList();
    return ResponseEntity.ok(items);
}


    @PostMapping("/add")
    public ResponseEntity<CartItem> addItem(
            @RequestParam String itemName,
            @RequestParam int quantity,
            @RequestParam double price
    ) {
        Long userId = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(cartService.addItemToCart(userId, itemName, quantity, price));
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
}
