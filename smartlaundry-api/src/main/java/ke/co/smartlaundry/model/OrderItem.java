package ke.co.smartlaundry.model;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private double totalPrice;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) {
        if (this.order != null) {
            this.order.getItems().remove(this);
            this.order.recalculateTotal();
        }
        this.order = order;
        if (order != null && !order.getItems().contains(this)) {
            order.getItems().add(this);
            order.recalculateTotal();
        }
    }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
        if (order != null) order.recalculateTotal();
    }

    public double getPrice() { return price; }
    public void setPrice(double price) {
        this.price = price;
        if (order != null) order.recalculateTotal();
    }

    public double getTotalPrice() { return totalPrice; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}
