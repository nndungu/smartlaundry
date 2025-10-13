package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.configuration.JwtUtil;
import ke.co.smartlaundry.service.AfricasTalkingSmsService;
import ke.co.smartlaundry.service.OtpService;
import ke.co.smartlaundry.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final RoleRepository roleRepository;
    private final JwtUtil jwtUtil;
    private AuthenticationManager authenticationManager;
    private OtpService otpService;
    private AfricasTalkingSmsService smsService;

    @Autowired
    public AuthController(UserService userService, RoleRepository roleRepository, JwtUtil jwtUtil, AuthenticationManager authenticationManager, OtpService otpService, AfricasTalkingSmsService smsService) {
        this.userService = userService;
        this.roleRepository = roleRepository;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.otpService = otpService;
        this.smsService = smsService;
    }

    // ==============================
    // REGISTER NEW USER
    // ==============================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequestDTO dto) {
        Role role = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new NoSuchElementException("Default role CUSTOMER not found"));

        User user = userService.fromRegisterDTO(dto, role);
        user = userService.createUser(user);

        String otp = otpService.generateOtp(user.getEmail());
        smsService.sendSMS(user.getPhone(), "Your Smartlaundry OTP is: " + otp );

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(new AuthResponseDTO(token, userService.toDTO(user)));
    }


    // ==============================================
    // Send OTP after registration
    // ==============================================
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestParam String email) {
        try {
            var user = userService.getUserByEmail(email);
            String otp = otpService.generateOtp(email);

            String message = "Your SmartLaundry verification code is: " + otp +
                    ". It expires in 5 minutes.";
            smsService.sendSMS(user.getPhone(), message);

            return ResponseEntity.ok("OTP sent to " + user.getPhone());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    // ==============================================
    // Verify OTP
    // ==============================================
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean valid = otpService.validateOtp(email, otp);
        if (!valid) {
            return ResponseEntity.badRequest().body("Invalid or expired OTP");
        }

        userService.markUserAsVerified(email);
        return ResponseEntity.ok("Phone verified successfully!");
    }

    // ==============================
    // LOGIN USER (uses AuthenticationManager)
    // ==============================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO dto) {
        try {
            User user = userService.getUserByEmail(dto.getEmail());

            // ✅ Use passwordEncoder check — avoids circular dependency
            if (!userService.checkPassword(dto.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new AuthResponseDTO(token, userService.toDTO(user)));

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }


    // ==============================
    // FORGOT PASSWORD
    // ==============================
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid PasswordResetRequestDTO dto) {
        try {
            userService.createPasswordResetToken(dto.getEmail());
            return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.ok("If an account exists with that email, a reset link has been sent.");
        }
    }

    // ==============================
    // RESET PASSWORD
    // ==============================
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordDTO dto) {
        boolean success = userService.resetPassword(dto.getToken(), dto.getNewPassword());
        if (!success) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
        return ResponseEntity.ok("Password reset successful");
    }
}

