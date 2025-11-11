/*
package ke.co.smartlaundry.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import ke.co.smartlaundry.dto.LoginResponseDTO;
import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.security.JwtUtil;
import ke.co.smartlaundry.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockitoBean private UserService userService;
    @MockitoBean private JwtUtil jwtUtil;

    private User testUser;

    @BeforeEach
    void init() {
        // Use your seed data user
        testUser = new User();
        testUser.setId(5L); // customer1 from seed data
        testUser.setUsername("John Mwangi");
        testUser.setEmail("customer1@smartlaundry.ke");
        testUser.setPhoneNumber("+254700000004");
        testUser.setPasswordHash("$2y$10$rZkaKCdPgJsOqiaF5PAeBepWT.rUYt9hhd4SuWAIqOltcymCeILmK");
    }

    @Test
    @DisplayName("Get profile returns user info")
    @WithMockUser(username = "customer1@smartlaundry.ke")
    void getProfile_shouldReturnUserDTO() throws Exception {
        when(userService.getUserFromToken(any())).thenReturn(testUser);
        when(userService.toDTO(testUser))
                .thenReturn(new UserDTO(testUser.getId(), testUser.getUsername(), testUser.getEmail(), testUser.getPhoneNumber()));

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("customer1@smartlaundry.ke"))
                .andExpect(jsonPath("$.username").value("John Mwangi"));
    }

    @Test
    @DisplayName("Update profile successfully")
    @WithMockUser(username = "customer1@smartlaundry.ke")
    void updateProfile_shouldReturnUpdatedUserDTO() throws Exception {
        testUser.setUsername("John Updated");
        testUser.setPhoneNumber("+254700000099");

        when(userService.getUserFromToken(any())).thenReturn(testUser);
        when(userService.updateUser(any(Long.class), any(User.class), any())).thenReturn(testUser);
        when(userService.toDTO(testUser))
                .thenReturn(new UserDTO(testUser.getId(), testUser.getUsername(), testUser.getEmail(), testUser.getPhoneNumber()));

        UserDTO dto = new UserDTO(testUser.getId(), "John Updated", testUser.getEmail(), "+254700000099");

        mockMvc.perform(put("/api/users/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("John Updated"))
                .andExpect(jsonPath("$.phoneNumber").value("+254700000099"));
    }

    @Test
    @DisplayName("Change password successfully")
    @WithMockUser(username = "customer1@smartlaundry.ke")
    void changePassword_shouldReturnSuccessMessage() throws Exception {
        when(userService.getUserFromToken(any())).thenReturn(testUser);
        when(userService.checkPassword("oldPass", testUser.getPasswordHash())).thenReturn(true);
        when(userService.encodePassword("newPass")).thenReturn("encodedNewPass");
        when(userService.updateUser(any(Long.class), any(User.class), any())).thenReturn(testUser);

        mockMvc.perform(post("/api/users/me/change-password")
                        .param("oldPassword", "oldPass")
                        .param("newPassword", "newPass"))
                .andExpect(status().isOk())
                .andExpect(content().string("Password updated successfully"));
    }

    @Test
    @DisplayName("Change email successfully")
    @WithMockUser(username = "customer1@smartlaundry.ke")
    void changeEmail_shouldReturnLoginResponseDTO() throws Exception {
        testUser.setEmail("newemail@smartlaundry.ke");

        when(userService.getUserFromToken(any())).thenReturn(testUser);
        when(userService.updateUser(any(Long.class), any(User.class), any())).thenReturn(testUser);
        when(userService.toDTO(testUser))
                .thenReturn(new UserDTO(testUser.getId(), testUser.getUsername(), testUser.getEmail(), testUser.getPhoneNumber()));
        when(jwtUtil.generateToken(testUser.getEmail())).thenReturn("newMockToken");

        mockMvc.perform(post("/api/users/me/change-email")
                        .param("newEmail", "newemail@smartlaundry.ke"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("newMockToken"))
                .andExpect(jsonPath("$.user.email").value("newemail@smartlaundry.ke"));
    }
}
*/
