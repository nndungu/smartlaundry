package ke.co.smartlaundry.dto;

import java.math.BigDecimal;

public class AddOrderItemRequestDTO {
    private Long priceListId;
    private Integer quantity;
    private BigDecimal price; // capture current price

    public AddOrderItemRequestDTO() {}

    public AddOrderItemRequestDTO(Long priceListId, Integer quantity, BigDecimal price) {
        this.priceListId = priceListId;
        this.quantity = quantity;
        this.price = price;
    }

    public Long getPriceListId() { return priceListId; }
    public void setPriceListId(Long priceListId) { this.priceListId = priceListId; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
