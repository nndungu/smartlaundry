package ke.co.smartlaundry.service;

import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.repository.PasswordResetTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest


public class UserServiceUnitTest {


        private UserService userService;

       @MockitoBean
        private UserRepository userRepository;

        @MockitoBean
        private RoleRepository roleRepository;

        @MockitoBean
        private PasswordResetTokenRepository tokenRepository;

        @MockitoBean
        private PasswordEncoder passwordEncoder;

        @BeforeEach
        void setUp() {
            userService = new UserService(userRepository, roleRepository, tokenRepository, passwordEncoder);
        }

        @Test
        void testGetUserByEmail_Success() {
            User user = new User();
            user.setId(1L);
            user.setEmail("user@example.com");
            user.setStatus(User.Status.ACTIVE); // Set status properly

            when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

            User result = userService.getUserByEmail("user@example.com");
            assertNotNull(result);
            assertEquals("user@example.com", result.getEmail());
            assertTrue(result.getIsActive()); // Uses getIsActive() method
        }

        @Test
        void testGetUserByEmail_NotFound() {
            when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());
            assertThrows(RuntimeException.class, () -> userService.getUserByEmail("unknown@example.com"));
        }

        @Test
        void testCreateUser() {
            User user = new User();
            user.setUsername("John Doe");
            user.setEmail("john@example.com");
            user.setPasswordHash("raw-pass");
            user.setStatus(User.Status.ACTIVE);

            when(passwordEncoder.encode("raw-pass")).thenReturn("encoded-pass");
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            User created = userService.createUser(user);

            assertEquals("encoded-pass", created.getPasswordHash());
            assertEquals(User.Status.ACTIVE, created.getStatus());
            verify(userRepository, times(1)).save(user);
        }

        @Test
        void testUpdateUser_ChangeRole() {
            User existing = new User();
            existing.setId(1L);
            existing.setEmail("user@example.com");
            existing.setStatus(User.Status.ACTIVE);

            Role newRole = new Role();
            newRole.setId((short) 2); // Role ID as Short
            newRole.setName("ADMIN");

            when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
            when(roleRepository.findByName("ADMIN")).thenReturn(Optional.of(newRole));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            User updatedUser = new User();
            updatedUser.setUsername("Updated Name");
            updatedUser.setEmail("user@example.com");

            User result = userService.updateUser(1L, updatedUser, "ADMIN");

            assertEquals("Updated Name", result.getUsername());
            assertEquals(newRole, result.getRole());
        }


}
