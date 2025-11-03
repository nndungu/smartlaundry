package ke.co.smartlaundry.dto;

import ke.co.smartlaundry.model.OrderStatus;

import java.sql.Timestamp;
import java.util.List;

public class OrderDTO {
    private Long id;
    private Long userId;
    private OrderStatus status;
    private Timestamp createdAt;
    private List<OrderItemDTO> items;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
}
