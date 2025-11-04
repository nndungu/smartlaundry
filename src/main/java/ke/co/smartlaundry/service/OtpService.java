package ke.co.smartlaundry.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    // Store OTP with timestamp
    private final Map<String, OtpEntry> otpStore = new ConcurrentHashMap<>();

    private static final int EXPIRATION_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 3;

    public String generateOtp(String email) {
        OtpEntry existing = otpStore.get(email);

        // Throttle: don't generate a new OTP if one exists and hasn't expired
        if (existing != null && existing.getExpiry().isAfter(LocalDateTime.now())) {
            return existing.getOtp();
        }

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000); // 6-digit
        OtpEntry entry = new OtpEntry(otp, LocalDateTime.now().plusMinutes(EXPIRATION_MINUTES));
        otpStore.put(email, entry);
        return otp;
    }

    public boolean validateOtp(String email, String otp) {
        OtpEntry entry = otpStore.get(email);
        if (entry == null) return false;

        if (entry.getExpiry().isBefore(LocalDateTime.now())) {
            otpStore.remove(email); // expired
            return false;
        }

        if (!entry.getOtp().equals(otp)) {
            entry.incrementAttempts();
            if (entry.getAttempts() >= MAX_ATTEMPTS) otpStore.remove(email); // too many attempts
            return false;
        }

        otpStore.remove(email); // single-use
        return true;
    }

    private static class OtpEntry {
        private final String otp;
        private final LocalDateTime expiry;
        private int attempts = 0;

        public OtpEntry(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }

        public String getOtp() {
            return otp;
        }

        public LocalDateTime getExpiry() {
            return expiry;
        }

        public int getAttempts() {
            return attempts;
        }

        public void incrementAttempts() {
            attempts++;
        }
    }
}
