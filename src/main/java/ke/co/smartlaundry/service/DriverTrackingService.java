package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.DriverLocationDTO;

public interface DriverTrackingService {
    void updateDriverLocation(Long driverId, double latitude, double longitude);
    DriverLocationDTO getDriverLocation(Long driverId);
}
