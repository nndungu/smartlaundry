package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.DriverEarningsDTO;
import ke.co.smartlaundry.dto.DriverEarningsDetailDTO;
import ke.co.smartlaundry.dto.EarningsDTO;

import java.util.List;

public interface DriverEarningsService {

     // Get total driver earnings.
    DriverEarningsDTO getTotalEarnings(Long driverId);


     // Get a list of detailed earning transactions.
    List<DriverEarningsDetailDTO> getEarningsHistory(Long driverId);

     // Record a new earning or deduction.
    EarningsDTO recordEarning(Long driverId, Long orderId, Long serviceTypeId, double amount, String transactionType);
}
