package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.NoSuchElementException;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    // Self-service: get own profile
    @Test
    @WithMockUser(username = "admin@laundromart.com", roles = {"ADMIN"})
    void testGetMyProfile_AsUser() throws Exception {
        User mockUser = new User();
        mockUser.setId(3L);
        mockUser.setEmail("admin@laundromart.com");
        mockUser.setFullName("Admin User");

        when(userService.getUserByEmail(anyString())).thenReturn(mockUser);

        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("Admin@laundromart.com"))
                .andExpect(jsonPath("$.fullName").value("Admin User"));
    }

    // Regular user forbidden from accessing other users
    @Test
    @WithMockUser(username = "driver@example.com", roles = {"DRIVER"})
    void testGetUserById_AsUser_Forbidden() throws Exception {
        mockMvc.perform(get("/api/users/3"))
                .andExpect(status().isForbidden());
    }

    // Admin can fetch user by ID
    @Test
    @WithMockUser(username = "admin@laundromart.com", roles = {"ADMIN"})
    void testGetUserById_AsAdmin() throws Exception {
        UserDTO mockUserDTO = new UserDTO();
        mockUserDTO.setId(4L);
        mockUserDTO.setEmail("owner@laundry.com");
        mockUserDTO.setFullName("Owner Ltd");

        when(userService.getUserById(eq(4L))).thenReturn(mockUserDTO);

        mockMvc.perform(get("/api/users/4"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("owner@laundry.com"))
                .andExpect(jsonPath("$.fullName").value("Owner Ltd"));
    }

    // Admin fetching non-existent user
    @Test
    @WithMockUser(username = "admin@laundromart.com", roles = {"ADMIN"})
    void testGetUserById_NotFound() throws Exception {
        when(userService.getUserById(eq(99L))).thenThrow(new NoSuchElementException());

        mockMvc.perform(get("/api/users/99"))
                .andExpect(status().isNotFound());
    }

    // Update own profile
    @Test
    @WithMockUser(username = "driver1@example.com", roles = {"DRIVER"})
    void testUpdateMyProfile() throws Exception {
        User mockUser = new User();
        mockUser.setId(3L);
        mockUser.setEmail("drive1r@example.com");
        mockUser.setFullName("John Driver");

        when(userService.getUserByEmail(anyString())).thenReturn(mockUser);

        User updatedUser = new User();
        updatedUser.setId(3L);
        updatedUser.setEmail("driver1@example.com");
        updatedUser.setFullName("Anne Driver");

        when(userService.updateUser(eq(3L), any(User.class), isNull())).thenReturn(updatedUser);

        mockMvc.perform(put("/api/users/me")
                        .contentType("application/json")
                        .content("{\"fullName\":\"John Driver\",\"phone\":\"+254722222222\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("+254722222222"));
    }

    // Change password (success)
    @Test
    @WithMockUser(username = "john@example.com", roles = {"USER"})
    void testChangePassword_Success() throws Exception {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("john@example.com");
        mockUser.setPasswordHash("encoded-old");

        when(userService.getUserByEmail(anyString())).thenReturn(mockUser);
        when(userService.checkPassword(eq("encoded-old"), eq("encoded-old"))).thenReturn(true);
        when(userService.encodePassword(eq("encoded-new"))).thenReturn("encoded-new");
        when(userService.updateUser(eq(1L), any(User.class), isNull())).thenReturn(mockUser);

        mockMvc.perform(post("/api/users/me/change-password")
                        .param("oldPassword", "cust123")
                        .param("newPassword", "cust456"))
                .andExpect(status().isOk())
                .andExpect(content().string("Password updated successfully"));
    }

    // Change password (wrong old password)
    @Test
    @WithMockUser(username = "john@example.com", roles = {"USER"})
    void testChangePassword_WrongOldPassword() throws Exception {
        User mockUser = new User();
        mockUser.setId(2L);
        mockUser.setEmail("john@example.com");
        mockUser.setPasswordHash("encoded-old");

        when(userService.getUserByEmail(anyString())).thenReturn(mockUser);
        when(userService.checkPassword(eq("just123"), eq("encoded-old"))).thenReturn(false);

        mockMvc.perform(post("/api/users/me/change-password")
                        .param("oldPassword", "wrongPass")
                        .param("newPassword", "newPass"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Old password is incorrect"));
    }

    // Change email
    @Test
    @WithMockUser(username = "John Customer", roles = {"USER"})
    void testChangeEmail() throws Exception {
        User mockUser = new User();
        mockUser.setId(2L);
        mockUser.setEmail("john@example.com");

        when(userService.getUserByEmail(anyString())).thenReturn(mockUser);

        User updatedUser = new User();
        updatedUser.setId(2L);
        updatedUser.setEmail("john@example.com");

        when(userService.updateUser(eq(2L), any(User.class), isNull())).thenReturn(updatedUser);

        mockMvc.perform(post("/api/users/me/change-email")
                        .param("newEmail", "newEmail"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("newEmail"));
    }
}
