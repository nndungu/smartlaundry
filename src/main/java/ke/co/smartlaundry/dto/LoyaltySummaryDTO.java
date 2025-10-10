package ke.co.smartlaundry.dto;


import java.util.List;

public class LoyaltySummaryDTO {
    private Long customerId;
    private Integer totalPoints;
    private String tierName;
    private Integer tierMinPoints;
    private List<LoyaltyEntryDTO> history;

    public LoyaltySummaryDTO(Long customerId, Integer totalPoints, String tierName, Integer tierMinPoints,
                             List<LoyaltyEntryDTO> history) {
        this.customerId = customerId;
        this.totalPoints = totalPoints;
        this.tierName = tierName;
        this.tierMinPoints = tierMinPoints;
        this.history = history;
    }

    // getters/setters
}
