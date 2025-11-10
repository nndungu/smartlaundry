package ke.co.smartlaundry.dto;

public class OrderRequestDTO {
    private Long orderId;
    private Long serviceTypeId;
    private String request;

    public OrderRequestDTO() {}

    public OrderRequestDTO(Long orderId, Long serviceTypeId, String request) {
        this.orderId = orderId;
        this.serviceTypeId = serviceTypeId;
        this.request = request;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getRequest() { return request; }
    public void setRequest(String request) { this.request = request; }

    public Long getServiceTypeId() { return serviceTypeId; }
    public void setServiceTypeId(Long serviceTypeId) { this.serviceTypeId = serviceTypeId; }
}
