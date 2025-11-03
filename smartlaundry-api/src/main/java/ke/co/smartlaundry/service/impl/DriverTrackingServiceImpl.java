package ke.co.smartlaundry.service.impl;

import ke.co.smartlaundry.dto.DriverLocationDTO;
import ke.co.smartlaundry.service.DriverTrackingService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class DriverTrackingServiceImpl implements DriverTrackingService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ConcurrentHashMap<Long, DriverLocationDTO> driverLocations = new ConcurrentHashMap<>();

    public DriverTrackingServiceImpl(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Override
    public void updateDriverLocation(Long driverId, double latitude, double longitude) {
        DriverLocationDTO location = new DriverLocationDTO(driverId, latitude, longitude, "ONLINE");
        driverLocations.put(driverId, location);

        // Notify subscribers in real-time
        messagingTemplate.convertAndSend("/topic/driver/" + driverId, location);
    }

    @Override
    public DriverLocationDTO getDriverLocation(Long driverId) {
        return driverLocations.get(driverId);
    }
}
