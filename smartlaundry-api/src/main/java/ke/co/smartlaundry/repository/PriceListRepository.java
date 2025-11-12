package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.PriceList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceListRepository extends JpaRepository<PriceList, Long> {

    List<PriceList> findByServiceTypeId(Long serviceTypeId);

    List<PriceList> findByCategoryId(Long categoryId);
}
