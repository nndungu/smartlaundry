package ke.co.smartlaundry.service;

import ke.co.smartlaundry.exceptions.ResourceNotFoundException;
import ke.co.smartlaundry.model.*;
import ke.co.smartlaundry.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       UserRepository userRepository,
                       CategoryRepository categoryRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Cart getCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    @Transactional
    public CartItem addItemToCart(Long userId, String itemName, int quantity, double price, Long categoryId) {
        Cart cart = getCartByUserId(userId);

        CartItem existingItem = cart.getItems().stream()
                .filter(i -> i.getItemName().equalsIgnoreCase(itemName))
                .findFirst()
                .orElse(null);

        Category category = null;
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            if (category != null) existingItem.setCategory(category);
            return cartItemRepository.save(existingItem);
        }

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setItemName(itemName);
        item.setQuantity(quantity);
        item.setPrice(price);
        item.setCategory(category);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeItem(Long itemId) {
        if (!cartItemRepository.existsById(itemId)) {
            throw new ResourceNotFoundException("Cart item not found");
        }
        cartItemRepository.deleteById(itemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear(); // orphanRemoval = true will delete items
        cartRepository.save(cart);
    }

    public List<CartItem> getItems(Long userId) {
        return getCartByUserId(userId).getItems();
    }

    public double calculateTotal(Long userId) {
        return getItems(userId).stream()
                .mapToDouble(i -> i.getQuantity() * i.getPrice())
                .sum();
    }
}
