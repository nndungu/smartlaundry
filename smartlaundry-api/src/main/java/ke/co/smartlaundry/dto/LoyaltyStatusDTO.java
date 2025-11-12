package ke.co.smartlaundry.dto;

public class LoyaltyStatusDTO {
    private String tierName;
    private int points;

    public LoyaltyStatusDTO() {}

    public LoyaltyStatusDTO(String tierName, int points) {
        this.tierName = tierName;
        this.points = points;
    }

    public String getTierName() { return tierName; }
    public void setTierName(String tierName) { this.tierName = tierName; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }
}
