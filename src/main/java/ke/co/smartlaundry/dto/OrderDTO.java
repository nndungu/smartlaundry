package ke.co.smartlaundry.dto;

import ke.co.smartlaundry.enums.OrderStatus;

import java.time.LocalDateTime;
import java.sql.Timestamp;

public class OrderDTO {
    private Long id;
    private OrderStatus status;
    private Double totalPrice;
    private LocalDateTime createdAt;

    public OrderDTO() {}

    public OrderDTO(Long id, OrderStatus status, Double totalPrice, LocalDateTime createdAt) {
        this.id = id;
        this.status = status;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt;
    }

    public OrderDTO(Long id, OrderStatus status, Double totalPrice, Timestamp createdAt) {
        this(id, status, totalPrice, createdAt != null ? createdAt.toLocalDateTime() : null);
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
