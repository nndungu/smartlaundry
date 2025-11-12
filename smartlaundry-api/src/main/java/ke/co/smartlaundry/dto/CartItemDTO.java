package ke.co.smartlaundry.dto;

public class CartItemDTO {
    private Long id;
    private String itemName;
    private int quantity;
    private double price;
    private String categoryName; // optional

    public CartItemDTO() {}

    public CartItemDTO(Long id, String itemName, int quantity, double price, String categoryName) {
        this.id = id;
        this.itemName = itemName;
        this.quantity = quantity;
        this.price = price;
        this.categoryName = categoryName;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}
