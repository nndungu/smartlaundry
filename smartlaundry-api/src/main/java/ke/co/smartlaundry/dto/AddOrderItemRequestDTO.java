package ke.co.smartlaundry.dto;

import java.math.BigDecimal;

public class AddOrderItemRequestDTO {
    public Long priceListId;
    public Integer quantity;
    public BigDecimal price; // capture current price
}
