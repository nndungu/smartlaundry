package ke.co.smartlaundry.service;

import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
    }

    public Cart getCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    public CartItem addItemToCart(Long userId, String itemName, int quantity, double price) {
        Cart cart = getCartByUserId(userId);

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setItemName(itemName);
        item.setQuantity(quantity);
        item.setPrice(price);

        cart.getItems().add(item);
        cartRepository.save(cart);

        return item;
    }

    public void removeItem(Long itemId) {
        cartItemRepository.deleteById(itemId);
    }

    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    public List<CartItem> getItems(Long userId) {
        return getCartByUserId(userId).getItems();
    }
}
