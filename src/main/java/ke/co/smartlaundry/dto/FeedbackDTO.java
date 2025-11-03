package ke.co.smartlaundry.dto;

import java.time.LocalDateTime;

public class FeedbackDTO {

    private Long id;
    private Long customerId;
    private Long driverId;
    private Long orderId;
    private int rating; // e.g. 1–5
    private String comments;
    private LocalDateTime createdAt;

    public FeedbackDTO() {}

    public FeedbackDTO(Long id, Long customerId, Long driverId, Long orderId, int rating, String comments, LocalDateTime createdAt) {
        this.id = id;
        this.customerId = customerId;
        this.driverId = driverId;
        this.orderId = orderId;
        this.rating = rating;
        this.comments = comments;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class GoogleLoginDTO {

        private String idToken;

        public GoogleLoginDTO() {}

        public GoogleLoginDTO(String idToken) {
            this.idToken = idToken;
        }

        public String getIdToken() {
            return idToken;
        }

        public void setIdToken(String idToken) {
            this.idToken = idToken;
        }
    }
}
