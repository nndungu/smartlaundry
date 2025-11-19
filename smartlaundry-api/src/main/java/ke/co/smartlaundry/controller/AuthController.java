package ke.co.smartlaundry.controller;

import jakarta.validation.Valid;
import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.security.JwtUtil;
import ke.co.smartlaundry.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;
    private final AfricasTalkingSmsService smsService;
    private final EmailService emailService;

    @Autowired
    public AuthController(
            UserService userService,
            RoleRepository roleRepository,
            JwtUtil jwtUtil,
            OtpService otpService,
            AfricasTalkingSmsService smsService,
            EmailService emailService
    ) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
        this.otpService = otpService;
        this.smsService = smsService;
        this.emailService = emailService;
    }

    // ====================== REGISTER ======================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequestDTO dto) {

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match");
        }

        try {
            Role role = roleRepository.findByName(dto.getRole().toUpperCase())
                    .orElseThrow(() -> new NoSuchElementException("Role not found: " + dto.getRole()));

            // User creation + admin passcode validation inside service
            User user = userService.fromRegisterDTO(dto, role, dto.getPasscode());
            user = userService.createUser(user);

            // Generate OTP
            String otp = otpService.generateOtp(user.getEmail());

            // Send SMS (non-blocking)
            try {
                smsService.sendSMS(user.getPhoneNumber(),
                        "Your SmartLaundry OTP is: " + otp + ". It expires in 5 minutes.");
            } catch (Exception ex) {
                System.out.println("⚠ SMS failed: " + ex.getMessage());
            }

            // Send Email
            emailService.sendOtpEmail(user.getEmail(), otp);

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getId(), user.getEmail(), role.getName());

            LoginResponseDTO response = new LoginResponseDTO(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    role.getName(),
                    "Registration successful — OTP sent",
                    null
            );

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    // ====================== LOGIN ======================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO dto) {
        try {
            User user = userService.getUserByEmail(dto.getEmail());

            if (!userService.checkPassword(dto.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().getName());

            return ResponseEntity.ok(new LoginResponseDTO(
                    token,
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getPhoneNumber(),
                    user.getRole().getName(),
                    "Login successful",
                    null
            ));

        } catch (NoSuchElementException ignored) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    // ====================== SEND OTP ======================
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        try {
            User user = userService.getUserByEmail(email);
            String otp = otpService.generateOtp(email);

            // Send SMS
            try {
                smsService.sendSMS(user.getPhoneNumber(),
                        "Your SmartLaundry verification code is: " + otp);
            } catch (Exception ex) {
                System.out.println("⚠ SMS failed: " + ex.getMessage());
            }

            // Send Email
            emailService.sendOtpEmail(email, otp);

            return ResponseEntity.ok("OTP sent to email & SMS");

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
        return ResponseEntity.ok("Verification successful!");
    }
}
