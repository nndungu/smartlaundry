package ke.co.smartlaundry.dto;

public class PriceListDTO {
    private Long id;
    private Long serviceTypeId;
    private Long categoryId;
    private String serviceTypeName;
    private String categoryName;
    private Double unitPrice;
    private String currency;

    public PriceListDTO() {}

    public PriceListDTO(Long id, Long serviceTypeId, Long categoryId, String serviceTypeName, String categoryName, Double unitPrice) {
        this.id = id;
        this.serviceTypeId = serviceTypeId;
        this.categoryId = categoryId;
        this.serviceTypeName = serviceTypeName;
        this.categoryName = categoryName;
        this.unitPrice = unitPrice;
    }

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getServiceTypeId() { return serviceTypeId; }
    public void setServiceTypeId(Long serviceTypeId) { this.serviceTypeId = serviceTypeId; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getServiceTypeName() { return serviceTypeName; }
    public void setServiceTypeName(String serviceTypeName) { this.serviceTypeName = serviceTypeName; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}
