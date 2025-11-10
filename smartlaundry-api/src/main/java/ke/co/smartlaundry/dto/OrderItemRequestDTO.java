package ke.co.smartlaundry.dto;

public class OrderItemRequestDTO {

    private String itemName;
    private int quantity;
    private double price;
    private Long categoryId; // optional

    // Getters & Setters
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}
