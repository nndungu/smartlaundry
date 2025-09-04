package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.dto.UserDTO;
import ke.co.smartlaundry.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserDTO, Long> {
    Optional<UserDTO> findByEmail(String email);
    boolean existsByEmail(String email);

}
