package ke.co.smartlaundry.service.impl;

import ke.co.smartlaundry.dto.FeedbackDTO;
import ke.co.smartlaundry.model.Feedback;
import ke.co.smartlaundry.model.Order;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.FeedbackRepository;
import ke.co.smartlaundry.repository.OrderRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    public FeedbackDTO submitFeedback(FeedbackDTO dto) {
        User customer = userRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found"));
        User driver = userRepository.findById(dto.getDriverId())
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        Feedback feedback = Feedback.builder()
                .customer(customer)
                .driver(driver)
                .order(order)
                .rating(dto.getRating())
                .comments(dto.getComments())
                .build();

        Feedback saved = feedbackRepository.save(feedback);
        return toDTO(saved);
    }

    @Override
    public List<FeedbackDTO> getFeedbackForDriver(Long driverId) {
        return feedbackRepository.findByDriverId(driverId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FeedbackDTO> getFeedbackForCustomer(Long customerId) {
        return feedbackRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FeedbackDTO> getAllFeedback() {
        return feedbackRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private FeedbackDTO toDTO(Feedback feedback) {
        return new FeedbackDTO(
                feedback.getId(),
                feedback.getCustomer() != null ? feedback.getCustomer().getId() : null,
                feedback.getDriver() != null ? feedback.getDriver().getId() : null,
                feedback.getOrder() != null ? feedback.getOrder().getId() : null,
                feedback.getRating(),
                feedback.getComments(),
                feedback.getCreatedAt()
        );
    }
}
