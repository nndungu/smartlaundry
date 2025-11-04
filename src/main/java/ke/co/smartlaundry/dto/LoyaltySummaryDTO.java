package ke.co.smartlaundry.dto;

import java.util.List;

public class LoyaltySummaryDTO {
    private Long customerId;
    private Integer totalPoints;
    private String tierName;
    private Integer tierMinPoints;
    private List<LoyaltyEntryDTO> history;

    public LoyaltySummaryDTO() {}

    public LoyaltySummaryDTO(Long customerId, Integer totalPoints, String tierName, Integer tierMinPoints,
                             List<LoyaltyEntryDTO> history) {
        this.customerId = customerId;
        this.totalPoints = totalPoints;
        this.tierName = tierName;
        this.tierMinPoints = tierMinPoints;
        this.history = history;
    }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }

    public String getTierName() { return tierName; }
    public void setTierName(String tierName) { this.tierName = tierName; }

    public Integer getTierMinPoints() { return tierMinPoints; }
    public void setTierMinPoints(Integer tierMinPoints) { this.tierMinPoints = tierMinPoints; }

    public List<LoyaltyEntryDTO> getHistory() { return history; }
    public void setHistory(List<LoyaltyEntryDTO> history) { this.history = history; }
}
