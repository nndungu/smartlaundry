package ke.co.smartlaundry.dto;

public class ServiceTypeDTO {

    private Long id;
    private String code;
    private String name;
    private String description;
    private Double basePrice;

    // --- Constructors ---
    public ServiceTypeDTO() {}

    // Used when code is available
    public ServiceTypeDTO(Long id, String code, String name, String description, Double basePrice) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.basePrice = basePrice;
    }

    // Used when code is not needed
    public ServiceTypeDTO(Long id, String name, String description, Double basePrice) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.basePrice = basePrice;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }
}
