package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.FeedbackDTO;
import ke.co.smartlaundry.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<FeedbackDTO> submitFeedback(@RequestBody FeedbackDTO dto) {
        return ResponseEntity.ok(feedbackService.submitFeedback(dto));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<FeedbackDTO>> getFeedbackForDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(feedbackService.getFeedbackForDriver(driverId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<FeedbackDTO>> getFeedbackForCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(feedbackService.getFeedbackForCustomer(customerId));
    }

    @GetMapping
    public ResponseEntity<List<FeedbackDTO>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }
}
