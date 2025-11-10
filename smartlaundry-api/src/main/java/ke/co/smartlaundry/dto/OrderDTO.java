package ke.co.smartlaundry.dto;

import ke.co.smartlaundry.enums.OrderStatus;

import java.sql.Timestamp;
import java.time.LocalDateTime;

public class OrderDTO {

    private Long id;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private Double totalPrice;
    private String serviceType;

    public OrderDTO() { }

    public OrderDTO(Long id, OrderStatus status, Double totalPrice, Timestamp createdAt) {
        this.id = id;
        this.status = status;
        this.totalPrice = totalPrice;
        this.createdAt = createdAt.toLocalDateTime();
    }

    public OrderDTO(long id, String pending, double totalPrice, Object createdAt) {
        this.id = id;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }
}
