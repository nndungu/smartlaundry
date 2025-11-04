package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {

    boolean existsByName(String name);
}
