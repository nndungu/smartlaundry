package ke.co.smartlaundry.dto;

import java.time.LocalDateTime;

public class LoyaltyEntryDTO {
    private Long id;
    private Long orderId;
    private Integer pointsEarned;
    private Integer pointsRedeemed;
    private LocalDateTime createdAt;

    public LoyaltyEntryDTO() {}

    public LoyaltyEntryDTO(Long id, Long orderId, Integer pointsEarned, Integer pointsRedeemed, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.pointsEarned = pointsEarned;
        this.pointsRedeemed = pointsRedeemed;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Integer getPointsEarned() { return pointsEarned; }
    public void setPointsEarned(Integer pointsEarned) { this.pointsEarned = pointsEarned; }

    public Integer getPointsRedeemed() { return pointsRedeemed; }
    public void setPointsRedeemed(Integer pointsRedeemed) { this.pointsRedeemed = pointsRedeemed; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
