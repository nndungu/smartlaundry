package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.Order;
import ke.co.smartlaundry.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Find all orders for a specific user
    List<Order> findByUserId(Long userId);

    // Optionally, find by status
    List<Order> findByStatus(OrderStatus status);
}
