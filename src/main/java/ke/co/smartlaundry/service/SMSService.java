package ke.co.smartlaundry.service;

import org.springframework.stereotype.Service;

@Service
public class SMSService {

    /**
     * For development, just log the message.
     * Later, integrate with Twilio or Africa's Talking for production.
     */
    public void sendSMS(String phoneNumber, String message) {
        System.out.println("Sending SMS to " + phoneNumber + " | Message: " + message);
    }
}
