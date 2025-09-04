package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.Cart;
import ke.co.smartlaundry.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserId(Long userId);
}
