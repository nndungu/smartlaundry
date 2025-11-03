package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.Role;
import ke.co.smartlaundry.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    User findUserByEmail(String email);

    List<User> findByRole(Role role);

    List<User> findByRole_Name(String role);
    long countByRole_Name(String role);

    boolean existsByEmail(String email);

    long countByRoleName(String role);

    boolean existsByPhoneNumber(String phoneNumber);
}
