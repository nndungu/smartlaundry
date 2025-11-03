package ke.co.smartlaundry.dto;

public class OrderRequestDTO {
    private Long orderId;
    private String request;

    public OrderRequestDTO() {}

    public OrderRequestDTO(Long orderId, String request) {
        this.orderId = orderId;
        this.request = request;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getRequest() { return request; }
    public void setRequest(String request) { this.request = request; }
}
