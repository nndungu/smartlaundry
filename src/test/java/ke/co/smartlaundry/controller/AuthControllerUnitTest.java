package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.dto.LoginRequestDTO;
import ke.co.smartlaundry.dto.RegisterRequestDTO;
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

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerUnitTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private RoleRepository roleRepository;

    @MockitoBean
    private JwtUtil jwtUtil;

    @Test
    void register_Success() throws Exception {
        RegisterRequestDTO request = new RegisterRequestDTO();
        request.setUsername("John Doe");
        request.setEmail("john@example.com");
        request.setPassword("secret123");
        request.setRoleName("USER");

        Role role = new Role();
        role.setId((short) 5);
        role.setName("USER");

        User user = new User();
        user.setId(5L);
        user.setUsername("John Doe");
        user.setEmail("john@example.com");
        user.setStatus(User.Status.ACTIVE);
        user.setRole(role);

        when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));
        when(userService.fromRegisterDTO(any(RegisterRequestDTO.class), eq(role))).thenReturn(user);
        when(userService.createUser(any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken("john@example.com")).thenReturn("mock-jwt");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"secret123\",\"roleName\":\"USER\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt"))
                .andExpect(jsonPath("$.user.email").value("john@example.com"))
                .andExpect(jsonPath("$.user.isActive").value(true));
    }

    @Test
    void login_Success() throws Exception {
        User user = new User();
        user.setId(5L);
        user.setEmail("john@example.com");
        user.setPasswordHash("encoded-pass");
        user.setStatus(User.Status.ACTIVE);

        when(userService.getUserByEmail("john@example.com")).thenReturn(user);
        when(userService.checkPassword("secret123", "encoded-pass")).thenReturn(true);
        when(jwtUtil.generateToken("john@example.com")).thenReturn("mock-jwt");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"john@example.com\",\"password\":\"secret123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-jwt"))
                .andExpect(jsonPath("$.user.email").value("john@example.com"))
                .andExpect(jsonPath("$.user.isActive").value(true));
    }
}
