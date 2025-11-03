package ke.co.smartlaundry.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;

import ke.co.smartlaundry.configuration.JwtUtil;
import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.service.AfricasTalkingSmsService;
import ke.co.smartlaundry.service.OtpService;
import ke.co.smartlaundry.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;
    private final AfricasTalkingSmsService smsService;
    private final GoogleIdTokenVerifier googleVerifier;

    @Value("${google.client.id}")
    private String googleClientId;

    private final JsonFactory jsonFactory = GsonFactory.getDefaultInstance();

    @Autowired
    public AuthController(
            UserService userService,
            RoleRepository roleRepository,
            JwtUtil jwtUtil,
            OtpService otpService,
            AfricasTalkingSmsService smsService,
            GoogleIdTokenVerifier googleVerifier
    ) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
        this.smsService = smsService;
        this.googleVerifier = googleVerifier;
    }

    // ====================== REGISTER ======================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequestDTO dto) {
        if (dto.getPassword() == null || !dto.getPassword().equals(dto.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        Role role = roleRepository.findByName(dto.getRole().toUpperCase())
                .orElseThrow(() -> new NoSuchElementException("Role not found: " + dto.getRole()));

        User user = new User();
        user.setUsername(dto.getFirstName() + " " + dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhone());
        user.setPasswordHash(userService.encodePassword(dto.getPassword()));
        user.setRole(role);
        user.setVerified(false);

        user = userService.createUser(user);

        String otp = otpService.generateOtp(user.getEmail());
        smsService.sendSMS(user.getPhoneNumber(), "Your SmartLaundry OTP is: " + otp);

        String token = jwtUtil.generateToken(user.getEmail());

        LoginResponseDTO response = new LoginResponseDTO(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPhoneNumber(),
                role.getName(),
                "Registration successful",
                null
        );

        return ResponseEntity.ok(response);
    }

    // ====================== LOGIN ======================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO dto) {
        try {
            User user = userService.getUserByEmail(dto.getEmail());
            if (!userService.checkPassword(dto.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            String token = jwtUtil.generateToken(user.getEmail());

            LoginResponseDTO response = new LoginResponseDTO(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getRole().getName(),
                    "Login successful",
                    null
            );

            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // ====================== GOOGLE LOGIN ======================
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody FeedbackDTO.GoogleLoginDTO dto) {
        try {
            GoogleIdToken idToken = googleVerifier.verify(dto.getIdToken());
            if (idToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");

            User user;
            try {
                user = userService.getUserByEmail(email);
            } catch (NoSuchElementException e) {
                Role role = roleRepository.findByName("CUSTOMER")
                        .orElseThrow(() -> new NoSuchElementException("Role not found: CUSTOMER"));

                user = new User();
                user.setUsername(firstName + " " + lastName);
                user.setEmail(email);
                user.setRole(role);
                user.setVerified(true);
                user.setStatus(User.Status.ACTIVE);
                user = userService.createUser(user);
            }

            String token = jwtUtil.generateToken(email);

            LoginResponseDTO response = new LoginResponseDTO(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getRole().getName(),
                    "Google login successful",
                    null
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Google login failed: " + e.getMessage());
        }
    }

    // ====================== SEND OTP ======================
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        try {
            User user = userService.getUserByEmail(email);
            String otp = otpService.generateOtp(email);

            smsService.sendSMS(user.getPhoneNumber(), "Your SmartLaundry verification code is: " + otp + ". It expires in 5 minutes.");
            return ResponseEntity.ok("OTP sent to " + user.getPhoneNumber());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    // ====================== VERIFY OTP ======================
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        if (!otpService.validateOtp(email, otp)) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }
        userService.markUserAsVerified(email);
        return ResponseEntity.ok("Phone verified successfully!");
    }

    // ====================== FORGOT PASSWORD ======================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid PasswordResetRequestDTO dto) {
        userService.createPasswordResetToken(dto.getEmail());
        return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
    }

    // ====================== RESET PASSWORD ======================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordDTO dto) {
        if (!userService.resetPassword(dto.getToken(), dto.getNewPassword())) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
        return ResponseEntity.ok("Password reset successful");
    }
}
