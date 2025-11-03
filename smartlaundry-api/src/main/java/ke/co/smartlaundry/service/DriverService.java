package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.*;
import java.util.List;

public interface DriverService {

    DriverDTO getDriverProfile(Long driverId);

    List<OrderDTO> getAssignedOrders(Long driverId);

    DriverEarningsDTO getEarnings(Long driverId);

    void updateLocation(Long driverId, double latitude, double longitude);

    List<DriverEarningsDetailDTO> getEarningsHistory(Long driverId);
}
