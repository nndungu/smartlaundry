package ke.co.smartlaundry.dto;

import java.util.List;
import ke.co.smartlaundry.model.LoyaltyLedger;

public class LoyaltyLedgerDTO {
    private Long customerId;
    private double totalPoints;
    private List<LoyaltyEntryDTO> entries;

    public LoyaltyLedgerDTO() {}

    public LoyaltyLedgerDTO(Long customerId, double totalPoints, List<LoyaltyEntryDTO> entries) {
        this.customerId = customerId;
        this.totalPoints = totalPoints;
        this.entries = entries;
    }




    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public double getTotalPoints() { return totalPoints; }
    public void setTotalPoints(double totalPoints) { this.totalPoints = totalPoints; }

    public List<LoyaltyEntryDTO> getEntries() { return entries; }
    public void setEntries(List<LoyaltyEntryDTO> entries) { this.entries = entries; }
}
