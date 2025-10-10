package ke.co.smartlaundry.dto;

import java.time.LocalDateTime;

public class LoyaltyEntryDTO {
    private Long id;
    private Long orderId;
    private Integer pointsEarned;
    private Integer pointsRedeemed;
    private LocalDateTime createdAt;

    public LoyaltyEntryDTO(Long id, Long orderId, Integer pointsEarned, Integer pointsRedeemed, LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.pointsEarned = pointsEarned;
        this.pointsRedeemed = pointsRedeemed;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
}