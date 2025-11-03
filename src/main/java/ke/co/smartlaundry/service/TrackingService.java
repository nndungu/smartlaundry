package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.DriverLocationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class TrackingService {

    private static final Logger log = LoggerFactory.getLogger(TrackingService.class);
    private final SimpMessagingTemplate messagingTemplate;

    public TrackingService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Publish driver location to:
     * - /topic/driver.{driverId}.location  (everyone)
     * - /queue/driver.{driverId}.driver    (private if needed)
     */
    public void publishDriverLocation(DriverLocationDTO dto) {
        String topic = "/topic/driver." + dto.getDriverId() + ".location";
        log.debug("Publishing driver location to {} : {}", topic, dto);
        messagingTemplate.convertAndSend(topic, dto);
    }
}
