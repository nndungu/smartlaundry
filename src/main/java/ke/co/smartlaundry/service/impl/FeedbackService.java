package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.FeedbackDTO;

import java.util.List;

public interface FeedbackService {
    FeedbackDTO submitFeedback(FeedbackDTO feedbackDTO);
    List<FeedbackDTO> getFeedbackForDriver(Long driverId);
    List<FeedbackDTO> getFeedbackForCustomer(Long customerId);
    List<FeedbackDTO> getAllFeedback();
}
