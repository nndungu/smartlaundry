package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.Order;
import ke.co.smartlaundry.enums.OrderStatus;
import org.springframework.boot.BootstrapContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long customerId);

    List<Order> findByDriverId(Long driverId);

    List<Order> findByUserId(Long userId);

    long countByDriverIdAndStatus(Long driverId, OrderStatus status);

    List<Order> findAllByUserId(Long id);
}
