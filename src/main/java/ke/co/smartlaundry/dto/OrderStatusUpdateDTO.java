package ke.co.smartlaundry.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderStatusUpdateDTO {
    private Long orderId;
    private String Status;
}
