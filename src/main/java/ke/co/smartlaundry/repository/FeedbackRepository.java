package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByDriverId(Long driverId);
    List<Feedback> findByCustomerId(Long customerId);
    List<Feedback> findByOrderId(Long orderId);
}
