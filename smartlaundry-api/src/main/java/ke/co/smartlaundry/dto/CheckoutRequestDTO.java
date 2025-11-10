package ke.co.smartlaundry.dto;

import java.util.List;

public class CheckoutRequestDTO {

    private String serviceType;
    private List<OrderItemRequestDTO> items;

    // Getters & Setters
    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public List<OrderItemRequestDTO> getItems() { return items; }
    public void setItems(List<OrderItemRequestDTO> items) { this.items = items; }
}
