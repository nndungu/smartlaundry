package ke.co.smartlaundry.controller;

import ke.co.smartlaundry.configuration.JwtUtil;
import ke.co.smartlaundry.dto.AuthResponseDTO;
import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.service.AfricasTalkingSmsService;
import ke.co.smartlaundry.service.OtpService;
import ke.co.smartlaundry.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class AuthControllerUnitTest {

    private UserService userService;
    private JwtUtil jwtUtil;
    private RoleRepository roleRepository;
    private AuthController authController;
    private PasswordEncoder passwordEncoder;
    private AuthenticationManager authenticationManager;
    private OtpService otpService;
    private AfricasTalkingSmsService smsService;

    @BeforeEach
    void setup() {
        userService = Mockito.mock(UserService.class);
        jwtUtil = Mockito.mock(JwtUtil.class);
        roleRepository = Mockito.mock(RoleRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        authenticationManager = Mockito.mock(AuthenticationManager.class);
        otpService = Mockito.mock(OtpService.class);
        smsService = Mockito.mock(AfricasTalkingSmsService.class);

        // Pass all six dependencies
        authController = new AuthController(
                userService,
                roleRepository,
                jwtUtil,
                authenticationManager,
                otpService,
                smsService
        );
    }

    @Test
    void register_shouldReturnTokenAndUser() {
        Mockito.when(roleRepository.findByName("CUSTOMER"))
                .thenReturn(Optional.of(new Role("CUSTOMER")));

        User user = new User();
        user.setEmail("test@example.com");
        user.setUsername("Test User");

        ke.co.smartlaundry.dto.UserDTO userDTO = new ke.co.smartlaundry.dto.UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setUsername(user.getUsername());

        Mockito.when(userService.fromRegisterDTO(Mockito.any(), Mockito.any())).thenReturn(user);
        Mockito.when(userService.createUser(user)).thenReturn(user);
        Mockito.when(userService.toDTO(user)).thenReturn(userDTO);
        Mockito.when(jwtUtil.generateToken(user.getEmail())).thenReturn("mockToken");

        ResponseEntity<?> response = authController.register(Mockito.mock(ke.co.smartlaundry.dto.RegisterRequestDTO.class));

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        AuthResponseDTO body = (AuthResponseDTO) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.getToken()).isEqualTo("mockToken");
        assertThat(body.getUser().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    void login_shouldReturnTokenForValidUser() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash(passwordEncoder.encode("Customer1@123"));

        ke.co.smartlaundry.dto.UserDTO userDTO = new ke.co.smartlaundry.dto.UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setUsername(user.getUsername());

        Mockito.when(userService.getUserByEmail("test@example.com")).thenReturn(user);
        Mockito.when(userService.checkPassword("Customer1@123", user.getPasswordHash())).thenReturn(true);
        Mockito.when(userService.toDTO(user)).thenReturn(userDTO);
        Mockito.when(jwtUtil.generateToken(user.getEmail())).thenReturn("mockToken");

        ke.co.smartlaundry.dto.LoginRequestDTO loginDTO = new ke.co.smartlaundry.dto.LoginRequestDTO();
        loginDTO.setEmail("test@example.com");
        loginDTO.setPassword("Customer1@123");

        ResponseEntity<?> response = authController.login(loginDTO);

        assertThat(response.getStatusCode().is2xxSuccessful()).isTrue();
        AuthResponseDTO body = (AuthResponseDTO) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.getToken()).isEqualTo("mockToken");
        assertThat(body.getUser().getEmail()).isEqualTo("test@example.com");
    }

    @Test
    void login_shouldReturnUnauthorizedForInvalidPassword() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash(passwordEncoder.encode("Customer@123"));

        Mockito.when(userService.getUserByEmail("test@example.com")).thenReturn(user);
        Mockito.when(userService.checkPassword("wrongpass", user.getPasswordHash())).thenReturn(false);

        ke.co.smartlaundry.dto.LoginRequestDTO loginDTO = new ke.co.smartlaundry.dto.LoginRequestDTO();
        loginDTO.setEmail("test@example.com");
        loginDTO.setPassword("wrongpass");

        ResponseEntity<?> response = authController.login(loginDTO);
        assertThat(response.getStatusCodeValue()).isEqualTo(401);
    }

    @Test
    void login_shouldReturnUnauthorizedForNonExistingUser() {
        Mockito.when(userService.getUserByEmail("missing@example.com"))
                .thenThrow(new NoSuchElementException("User not found"));

        ke.co.smartlaundry.dto.LoginRequestDTO loginDTO = new ke.co.smartlaundry.dto.LoginRequestDTO();
        loginDTO.setEmail("missing@example.com");
        loginDTO.setPassword("anything");

        ResponseEntity<?> response = authController.login(loginDTO);
        assertThat(response.getStatusCodeValue()).isEqualTo(401);
    }
}
