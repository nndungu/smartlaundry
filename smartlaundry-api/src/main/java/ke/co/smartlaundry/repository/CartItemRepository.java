package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
