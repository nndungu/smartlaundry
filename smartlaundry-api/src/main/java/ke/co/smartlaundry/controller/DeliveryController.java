package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.model.DeliveryRequest;
import ke.co.smartlaundry.service.DeliveryRequestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final DeliveryRequestService deliveryRequestService;

    public DeliveryController(DeliveryRequestService deliveryRequestService) {
        this.deliveryRequestService = deliveryRequestService;
    }

    @PostMapping("/request/{orderId}")
    public DeliveryRequest createRequest(@PathVariable Long orderId) {
        return deliveryRequestService.createDeliveryRequest(orderId);
    }

    @GetMapping("/pending")
    public List<DeliveryRequest> getPendingRequests() {
        return deliveryRequestService.getPendingRequests();
    }

    @PostMapping("/{requestId}/accept")
    public DeliveryRequest acceptRequest(
            @PathVariable Long requestId,
            @RequestParam Long driverId) {
        return deliveryRequestService.acceptRequest(requestId, driverId);
    }

    @PostMapping("/{requestId}/decline")
    public DeliveryRequest declineRequest(
            @PathVariable Long requestId,
            @RequestParam Long driverId) {
        return deliveryRequestService.declineRequest(requestId, driverId);
    }

    @PostMapping("/{requestId}/complete")
    public DeliveryRequest completeRequest(@PathVariable Long requestId) {
        return deliveryRequestService.completeRequest(requestId);
    }
}
