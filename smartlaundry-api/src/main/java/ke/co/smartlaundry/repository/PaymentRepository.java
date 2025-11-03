package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.Order;
import ke.co.smartlaundry.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find a payment by its unique transaction reference
    Optional<Payment> findByTransactionRef(String transactionRef);

    List<Payment> findByOrder(Order order);

    // Find all payments for a given order
    List<Payment> findByOrderId(Long orderId);
}
