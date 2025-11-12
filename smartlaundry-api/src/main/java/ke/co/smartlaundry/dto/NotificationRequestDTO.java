package ke.co.smartlaundry.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequestDTO {
    private Long recipientId;  // user or driver ID
    private String recipientRole; // e.g. "CUSTOMER", "DRIVER", "ALL"
    private String title;
    private String message;
    private String channel; // "EMAIL", "SMS", "IN_APP"
}
