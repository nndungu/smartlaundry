package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.DriverLocationLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DriverLocationLogRepository extends JpaRepository<DriverLocationLog, Long> {
    List<DriverLocationLog> findByDriverId(Long driverId);
}
