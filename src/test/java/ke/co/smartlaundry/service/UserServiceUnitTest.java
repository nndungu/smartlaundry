package ke.co.smartlaundry.service;

import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.RoleRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.repository.PasswordResetTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

class UserServiceUnitTest {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordResetTokenRepository passwordResetTokenRepository;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    void setup() {
        userRepository = Mockito.mock(UserRepository.class);
        roleRepository = Mockito.mock(RoleRepository.class);
        passwordResetTokenRepository = Mockito.mock(PasswordResetTokenRepository.class);
        passwordEncoder = Mockito.mock(PasswordEncoder.class);

        // ✅ Match the exact constructor in UserService
        userService = new UserService(
                userRepository,
                roleRepository,
                passwordResetTokenRepository,
                passwordEncoder
        );
    }

    @Test
    void registerUser_shouldEncodePasswordAndSave() {
        User user = new User();
        user.setEmail("test@example.com");
        user.setPasswordHash("plain123");

        Mockito.when(passwordEncoder.encode("plain123")).thenReturn("encoded123");
        Mockito.when(userRepository.save(Mockito.any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        User saved = userService.registerUser(user);

        assertThat(saved.getPasswordHash()).isEqualTo("encoded123");
        Mockito.verify(userRepository).save(Mockito.any(User.class));
    }


    @Test
    void findUserByEmail_shouldReturnUser() {
        User user = new User();
        user.setEmail("test@example.com");
        Mockito.when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

        User found = userService.findUserByEmail("test@example.com");
        assertThat(found).isNotNull();
    }

    @Test
    void findUserByEmail_shouldThrowIfNotFound() {
        Mockito.when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> userService.findUserByEmail("missing@example.com"))
                .isInstanceOf(RuntimeException.class);
    }
}
