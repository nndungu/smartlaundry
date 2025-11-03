package ke.co.smartlaundry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import ke.co.smartlaundry.configuration.JwtUtil;
import ke.co.smartlaundry.configuration.MockGoogleConfig;
import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.service.AfricasTalkingSmsService;
import ke.co.smartlaundry.service.EmailService;
import ke.co.smartlaundry.service.OtpService;
import ke.co.smartlaundry.service.UserService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private RoleRepository roleRepository;

    @MockitoBean
    private OtpService otpService;

    @MockitoBean
    private AfricasTalkingSmsService smsService;

    @MockitoBean
    private EmailService emailService;

    @MockitoBean
    private GoogleIdTokenVerifier googleVerifier;

    // ============================
    // REGISTER TEST
    // ============================
    @Test
    @DisplayName("Registering a new customer should return token and user info")
    void registerNewCustomer_shouldReturnTokenAndUser() throws Exception {
        Role role = new Role("CUSTOMER");
        when(roleRepository.findByName("CUSTOMER")).thenReturn(Optional.of(role));

        User user = new User();
        user.setId(1L);
        user.setEmail("newcustomer@smartlaundry.ke");
        user.setUsername("New Customer");
        user.setPhoneNumber("0700000000");
        user.setRole(role);

        when(userService.encodePassword(anyString())).thenReturn("encodedPass");
        when(userService.createUser(any(User.class))).thenReturn(user);
        when(otpService.generateOtp(anyString())).thenReturn("123456");
        when(smsService.sendSMS(anyString(), anyString())).thenReturn(true);
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());
        when(jwtUtil.generateToken(user.getEmail())).thenReturn("mockToken");

        RegisterRequestDTO dto = new RegisterRequestDTO();
        dto.setFirstName("New");
        dto.setLastName("Customer");
        dto.setEmail("newcustomer@smartlaundry.ke");
        dto.setPhone("0700000000");
        dto.setPassword("Customer@123");
        dto.setConfirmPassword("Customer@123");
        dto.setRole("CUSTOMER");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mockToken"))
                .andExpect(jsonPath("$.email").value("newcustomer@smartlaundry.ke"))
                .andExpect(jsonPath("$.username").value("New Customer"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }

    // ============================
    // LOGIN TESTS
    // ============================
    @Test
    @DisplayName("Valid login should return token")
    void loginWithValidUser_shouldReturnToken() throws Exception {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPasswordHash("encodedPass");
        user.setUsername("Test User");
        user.setRole(new Role("CUSTOMER"));

        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(userService.checkPassword("password123", "encodedPass")).thenReturn(true);
        when(jwtUtil.generateToken(user.getEmail())).thenReturn("mockToken");

        LoginRequestDTO dto = new LoginRequestDTO("user@example.com", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mockToken"))
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }

    @Test
    @DisplayName("Login with invalid password should return 401")
    void loginWithInvalidPassword_shouldReturnUnauthorized() throws Exception {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPasswordHash("encodedPass");

        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(userService.checkPassword("wrongpass", "encodedPass")).thenReturn(false);

        LoginRequestDTO dto = new LoginRequestDTO("user@example.com", "wrongpass");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }

    // ============================
    // GOOGLE LOGIN TEST
    // ============================
    @Test
    @DisplayName("Google login with valid token should return JWT")
    void googleLogin_shouldReturnToken() throws Exception {
        String email = "google@example.com";
        String firstName = "Google";
        String lastName = "User";

        GoogleIdToken.Payload payload = mock(GoogleIdToken.Payload.class);
        when(payload.getEmail()).thenReturn(email);
        when(payload.get("given_name")).thenReturn(firstName);
        when(payload.get("family_name")).thenReturn(lastName);

        GoogleIdToken idToken = mock(GoogleIdToken.class);
        when(idToken.getPayload()).thenReturn(payload);

        when(googleVerifier.verify("mockIdToken")).thenReturn(idToken);

        Role role = new Role("CUSTOMER");
        when(roleRepository.findByName("CUSTOMER")).thenReturn(Optional.of(role));

        User newUser = new User();
        newUser.setId(10L);
        newUser.setEmail(email);
        newUser.setUsername(firstName + " " + lastName);
        newUser.setRole(role);

        when(userService.getUserByEmail(email)).thenThrow(new NoSuchElementException());
        when(userService.createUser(any(User.class))).thenReturn(newUser);
        when(jwtUtil.generateToken(email)).thenReturn("googleToken");

        FeedbackDTO.GoogleLoginDTO dto = new FeedbackDTO.GoogleLoginDTO();
        dto.setIdToken("mockIdToken");

        when(smsService.sendSMS(anyString(), anyString())).thenReturn(true);
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());

        mockMvc.perform(post("/api/auth/google-login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("googleToken"))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.username").value(firstName + " " + lastName))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }

    // ============================
    // FORGOT PASSWORD TEST
    // ============================
    @Test
    @DisplayName("Forgot password should return confirmation message")
    void forgotPassword_shouldReturnConfirmationMessage() throws Exception {
        PasswordResetRequestDTO dto = new PasswordResetRequestDTO();
        dto.setEmail("user@example.com");

        when(userService.createPasswordResetToken(anyString())).thenReturn("mock-reset-token");

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("If an account exists with that email, a reset link has been sent."));
    }

    // ============================
    // SEND OTP TEST
    // ============================
    @Test
    @DisplayName("Send OTP should return confirmation message")
    void sendOtp_shouldReturnMessage() throws Exception {
        User user = new User();
        user.setEmail("user@example.com");
        user.setPhoneNumber("0700000000");

        when(userService.getUserByEmail("user@example.com")).thenReturn(user);
        when(otpService.generateOtp("user@example.com")).thenReturn("123456");
        when(smsService.sendSMS(anyString(), anyString())).thenReturn(true);


        mockMvc.perform(post("/api/auth/send-otp")
                        .param("email", "user@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("OTP sent to 0700000000"));
    }

    // ============================
    // VERIFY OTP TEST
    // ============================
    @Test
    @DisplayName("Verify OTP with valid code should succeed")
    void verifyOtp_shouldReturnSuccess() throws Exception {
        doNothing().when(userService).markUserAsVerified("user@example.com");
        when(otpService.validateOtp("user@example.com", "123456")).thenReturn(true);

        mockMvc.perform(post("/api/auth/verify-otp")
                        .param("email", "user@example.com")
                        .param("otp", "123456"))
                .andExpect(status().isOk())
                .andExpect(content().string("Phone verified successfully!"));
    }

    @Test
    @DisplayName("Verify OTP with invalid code should fail")
    void verifyOtp_invalid_shouldReturnBadRequest() throws Exception {
        when(otpService.validateOtp("user@example.com", "wrong")).thenReturn(false);

        mockMvc.perform(post("/api/auth/verify-otp")
                        .param("email", "user@example.com")
                        .param("otp", "wrong"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid or expired OTP"));
    }

    // ============================
    // RESET PASSWORD TEST
    // ============================
    @Test
    @DisplayName("Reset password with valid token should succeed")
    void resetPassword_shouldReturnSuccess() throws Exception {
        ResetPasswordDTO dto = new ResetPasswordDTO();
        dto.setToken("valid-token");
        dto.setNewPassword("NewPass123");

        when(userService.resetPassword("valid-token", "NewPass123")).thenReturn(true);

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset successful"));
    }

    @Test
    @DisplayName("Reset password with invalid token should fail")
    void resetPassword_invalid_shouldReturnBadRequest() throws Exception {
        ResetPasswordDTO dto = new ResetPasswordDTO();
        dto.setToken("invalid-token");
        dto.setNewPassword("NewPass123");

        when(userService.resetPassword("invalid-token", "NewPass123")).thenReturn(false);

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid or expired token"));
    }
}
