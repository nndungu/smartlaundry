package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.EarningsLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface EarningsLedgerRepository extends JpaRepository<EarningsLedger, Long> {

    /** Sum total earnings for a specific driver */
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM EarningsLedger e WHERE e.driver.id = :driverId")
    double sumAmountByDriverId(@Param("driverId") Long driverId);

    /** List all earnings records for a driver */
    List<EarningsLedger> findByDriverId(Long driverId);

    /** Sum of all earnings in the system */
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM EarningsLedger e")
    double getTotalEarnings();

}

