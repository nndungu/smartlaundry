package ke.co.smartlaundry.service;

import java.util.Map;

public interface MpesaService {
    boolean initiateSTKPush(String phone, double amount, String transactionRef, String description);
    Map<String,Object> parseCallback(String callbackBody);
}
