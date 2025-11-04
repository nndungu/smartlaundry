package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.enums.DeliveryStatus;
import ke.co.smartlaundry.model.DeliveryRequest;
import org.springframework.boot.BootstrapContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public interface DeliveryRequestRepository extends JpaRepository<DeliveryRequest, Long> {

    List<DeliveryRequest> findByDriver_IdAndStatus(Long driverId, DeliveryStatus status);
    List<DeliveryRequest> findByStatus(DeliveryStatus status);

    List<DeliveryRequest> findAllByDriverId(Long id);
}
