package ke.co.smartlaundry.dto;

public class OrderItemDTO {
    private Long id;
    private Long orderId;
    private String itemName;
    private String categoryName;
    private int quantity;
    private double price;
    private double totalPrice;

    public OrderItemDTO() {}

    public OrderItemDTO(Long id, Long orderId, String itemName, String categoryName,
                        int quantity, double price, double totalPrice) {
        this.id = id;
        this.orderId = orderId;
        this.itemName = itemName;
        this.categoryName = categoryName;
        this.quantity = quantity;
        this.price = price;
        this.totalPrice = totalPrice;
    }

    // getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
}
