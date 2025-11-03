package ke.co.smartlaundry.dto;

public class LoyaltyTierDTO {
    private Long id;
    private String code;
    private String name;
    private Integer minPoints;
    private Double multiplier;
    private String benefits;

    // Constructors
    public LoyaltyTierDTO() {}

    public LoyaltyTierDTO(Long id, String code, String name, Integer minPoints, Double multiplier, String benefits) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.minPoints = minPoints;
        this.multiplier = multiplier;
        this.benefits = benefits;
    }

    // Getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getMinPoints() { return minPoints; }
    public void setMinPoints(Integer minPoints) { this.minPoints = minPoints; }

    public Double getMultiplier() { return multiplier; }
    public void setMultiplier(Double multiplier) { this.multiplier = multiplier; }

    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
}
