package ke.co.smartlaundry.service;

import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();
    private static final long EXPIRATION_TIME_MS = 5 * 60 * 1000; // 5 minutes

    private static class OtpEntry {
        String otp;
        long timestamp;
        OtpEntry(String otp, long timestamp) {
            this.otp = otp;
            this.timestamp = timestamp;
        }
    }

    public String generateOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(email, new OtpEntry(otp, Instant.now().toEpochMilli()));
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null) return false;
        boolean isValid = entry.otp.equals(otp) &&
                (Instant.now().toEpochMilli() - entry.timestamp) < EXPIRATION_TIME_MS;
        if (isValid) otpStore.remove(email); // OTP used once
        return isValid;
    }
}
