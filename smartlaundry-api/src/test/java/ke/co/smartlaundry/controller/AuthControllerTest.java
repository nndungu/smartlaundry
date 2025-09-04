package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.*;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.configuration.JwtUtil;
import ke.co.smartlaundry.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;
    @MockitoBean
    private RoleRepository roleRepository;
    @MockitoBean
    private JwtUtil jwtUtil;

    // Register success
    @Test
    void testRegister_Success() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setFullName("John Doe");
        request.setEmail("john@example.com");
        request.setPassword("secret123");

        Role role = new Role();
        role.setId(1L);
        role.setName("USER");

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("john@example.com");
        mockUser.setFullName("John Doe");

        when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));
        when(userService.fromRegisterDTO(any(RegisterRequestDTO.class), eq(role))).thenReturn(mockUser);
        when(userService.createUser(any(User.class))).thenReturn(mockUser);
        when(jwtUtil.generateToken(eq("john@example.com"))).thenReturn("mock-jwt");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"secret123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt"))
                .andExpect(jsonPath("$.user.email").value("john@example.com"));
    }

    // Register fails - missing role
    @Test
    void testRegister_MissingRole() throws Exception {
        when(roleRepository.findByName("USER")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"secret123\"}"))
                .andExpect(status().is5xxServerError()); // will throw NoSuchElementException
    }

    // Login success
    @Test
    void testLogin_Success() throws Exception {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("john@example.com");
        mockUser.setPasswordHash("encoded-pass");

        when(userService.getUserByEmail(eq("john@example.com"))).thenReturn(mockUser);
        when(userService.checkPassword(eq("secret123"), eq("encoded-pass"))).thenReturn(true);
        when(jwtUtil.generateToken(eq("john@example.com"))).thenReturn("mock-jwt");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"john@example.com\",\"password\":\"secret123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt"))
                .andExpect(jsonPath("$.user.email").value("john@example.com"));
    }

    // Login fails - wrong password
    @Test
    void testLogin_InvalidPassword() throws Exception {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("john@example.com");
        mockUser.setPasswordHash("encoded-pass");

        when(userService.getUserByEmail(eq("john@example.com"))).thenReturn(mockUser);
        when(userService.checkPassword(eq("wrongpass"), eq("encoded-pass"))).thenReturn(false);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"john@example.com\",\"password\":\"wrongpass\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }

    // Login fails - user not found
    @Test
    void testLogin_UserNotFound() throws Exception {
        when(userService.getUserByEmail(eq("john@example.com"))).thenThrow(new NoSuchElementException());

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"john@example.com\",\"password\":\"secret123\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid credentials"));
    }

    // Forgot password - user exists
    @Test
    void testForgotPassword_Success() throws Exception {
        when(userService.createPasswordResetToken(eq("john@example.com"))).thenReturn("reset-token");

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"john@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("If an account exists with that email, a reset link has been sent."));
    }

    // Forgot password - user not found (still returns 200)
    @Test
    void testForgotPassword_UserNotFound() throws Exception {
        when(userService.createPasswordResetToken(eq("john@example.com"))).thenThrow(new NoSuchElementException());

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"john@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("If an account exists with that email, a reset link has been sent."));
    }

    // Reset password success
    @Test
    void testResetPassword_Success() throws Exception {
        when(userService.resetPassword(eq("valid-token"), eq("newPass"))).thenReturn(true);

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\":\"valid-token\",\"newPassword\":\"newPass\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Password reset successful"));
    }

    // Reset password fails - invalid token
    @Test
    void testResetPassword_InvalidToken() throws Exception {
        when(userService.resetPassword(eq("invalid-token"), eq("newPass"))).thenReturn(false);

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\":\"invalid-token\",\"newPassword\":\"newPass\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Invalid or expired token"));
    }
}
