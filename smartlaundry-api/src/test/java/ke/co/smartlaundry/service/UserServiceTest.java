package ke.co.smartlaundry.service;

import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserService userService;
    @Test
    public void TestGetUserById() {
        User user = new User();
        user.setId(1L);
        user.setFullName("admin");

        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        UserDTO result = userService.getUserById(1L);

        assertEquals(user, result);
    }
}
