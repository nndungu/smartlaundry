package ke.co.smartlaundry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import ke.co.smartlaundry.security.JwtUtil;
import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.service.AfricasTalkingSmsService;
import ke.co.smartlaundry.service.EmailService;
import ke.co.smartlaundry.service.OtpService;
import ke.co.smartlaundry.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;

    @MockitoBean private UserService userService;
    @MockitoBean private JwtUtil jwtUtil;
    @MockitoBean private OtpService otpService;
    @MockitoBean private AfricasTalkingSmsService smsService;
    @MockitoBean private EmailService emailService;
    @MockitoBean private GoogleIdTokenVerifier googleVerifier;

    private User testUser;
    private Role customerRole;

    @BeforeEach
    void init() {
        // Fetch a seeded test user dynamically
        testUser = userRepository.findByEmail("customer1@example.com")
                .orElseThrow(() -> new IllegalStateException("Test user not found"));
        customerRole = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new IllegalStateException("CUSTOMER role missing"));
    }

    // Helper DTO builders
    private RegisterRequestDTO buildRegisterDTO(String email, String firstName, String lastName) {
        RegisterRequestDTO dto = new RegisterRequestDTO();
        dto.setFirstName(firstName);
        dto.setLastName(lastName);
        dto.setEmail(email);
        dto.setPhone("0712345678");
        dto.setPassword("Password@123");
        dto.setConfirmPassword("Password@123");
        dto.setRole("CUSTOMER");
        return dto;
    }

    private LoginRequestDTO buildLoginDTO(String email, String password) {
        return new LoginRequestDTO(email, password);
    }

    // ============================
    // REGISTER TEST
    // ============================
    @Test
    @DisplayName("Register new customer dynamically")
    void registerNewCustomer_shouldReturnTokenAndUser() throws Exception {
        String email = "dynamicuser@smartlaundry.test";

        when(roleRepository.findByName("CUSTOMER")).thenReturn(Optional.of(customerRole));
        when(userService.encodePassword(anyString())).thenReturn("encodedPass");

        User newUser = new User();
        newUser.setId(999L);
        newUser.setEmail(email);
        newUser.setUsername("Dynamic User");
        newUser.setRole(customerRole);

        when(userService.createUser(any(User.class))).thenReturn(newUser);
        when(otpService.generateOtp(email)).thenReturn("123456");
        when(smsService.sendSMS(anyString(), anyString())).thenReturn(true);
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());
        when(jwtUtil.generateToken(email)).thenReturn("mockToken");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildRegisterDTO(email, "Dynamic", "User"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mockToken"))
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));

        // Verify side effects
        verify(otpService, times(1)).generateOtp(email);
        verify(smsService, times(1)).sendSMS(anyString(), anyString());
        verify(emailService, times(1)).sendEmail(anyString(), anyString(), anyString());
    }

    // ============================
    // LOGIN TESTS
    // ============================
    @Test
    @DisplayName("Login with existing user")
    void loginWithValidUser_shouldReturnToken() throws Exception {
        when(userService.getUserByEmail(testUser.getEmail())).thenReturn(testUser);
        when(userService.checkPassword("Password@123", testUser.getPasswordHash())).thenReturn(true);
        when(jwtUtil.generateToken(testUser.getEmail())).thenReturn("loginToken");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildLoginDTO(testUser.getEmail(), "Password@123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("loginToken"))
                .andExpect(jsonPath("$.email").value(testUser.getEmail()))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }

    @Test
    @DisplayName("Login with invalid password should fail")
    void loginWithInvalidPassword_shouldReturnUnauthorized() throws Exception {
        when(userService.getUserByEmail(testUser.getEmail())).thenReturn(testUser);
        when(userService.checkPassword("wrong", testUser.getPasswordHash())).thenReturn(false);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(buildLoginDTO(testUser.getEmail(), "wrong"))))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }

    // ============================
    // OTP TEST
    // ============================
    @Test
    @DisplayName("Send OTP dynamically")
    void sendOtp_shouldReturnMessage() throws Exception {
        when(userService.getUserByEmail(testUser.getEmail())).thenReturn(testUser);
        when(otpService.generateOtp(testUser.getEmail())).thenReturn("123456");
        when(smsService.sendSMS(anyString(), anyString())).thenReturn(true);

        mockMvc.perform(post("/api/auth/send-otp").param("email", testUser.getEmail()))
                .andExpect(status().isOk())
                .andExpect(content().string("OTP sent to " + testUser.getPhoneNumber()));
    }

    @Test
    @DisplayName("Verify OTP dynamically")
    void verifyOtp_shouldReturnSuccess() throws Exception {
        when(otpService.validateOtp(testUser.getEmail(), "123456")).thenReturn(true);
        doNothing().when(userService).markUserAsVerified(testUser.getEmail());

        mockMvc.perform(post("/api/auth/verify-otp")
                        .param("email", testUser.getEmail())
                        .param("otp", "123456"))
                .andExpect(status().isOk())
                .andExpect(content().string("Phone verified successfully!"));
    }
}
