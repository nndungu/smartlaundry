package ke.co.smartlaundry.service.impl;

import ke.co.smartlaundry.dto.DriverEarningsDTO;
import ke.co.smartlaundry.dto.DriverEarningsDetailDTO;
import ke.co.smartlaundry.dto.EarningsDTO;
import ke.co.smartlaundry.model.EarningsLedger;
import ke.co.smartlaundry.model.User;
import ke.co.smartlaundry.repository.EarningsLedgerRepository;
import ke.co.smartlaundry.repository.UserRepository;
import ke.co.smartlaundry.service.DriverEarningsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class DriverEarningsServiceImpl implements DriverEarningsService {

    private static final Logger log = LoggerFactory.getLogger(DriverEarningsServiceImpl.class);

    private final EarningsLedgerRepository earningsLedgerRepository;
    private final UserRepository userRepository;

    public DriverEarningsServiceImpl(EarningsLedgerRepository earningsLedgerRepository, UserRepository userRepository) {
        this.earningsLedgerRepository = earningsLedgerRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    @Override
    public DriverEarningsDTO getTotalEarnings(Long driverId) {
        double total = earningsLedgerRepository.sumAmountByDriverId(driverId);
        return new DriverEarningsDTO(driverId, total);
    }

    @Transactional(readOnly = true)
    @Override
    public List<DriverEarningsDetailDTO> getEarningsHistory(Long driverId) {
        return earningsLedgerRepository.findByDriverId(driverId).stream()
                .map(e -> new DriverEarningsDetailDTO(
                        e.getOrderId(),
                        e.getServiceTypeId(),
                        e.getAmount(),
                        e.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public EarningsDTO recordEarning(Long driverId, Long orderId, Long serviceTypeId, double amount, String transactionType) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new NoSuchElementException("Driver not found"));

        EarningsLedger entry = new EarningsLedger(driver, orderId, serviceTypeId, amount, transactionType);
        earningsLedgerRepository.save(entry);

        log.info("Earning recorded for driver {}: {} KES ({}), order={}",
                driver.getUsername(), amount, transactionType, orderId);

        return new EarningsDTO(
                entry.getId(),
                driverId,
                entry.getAmount(),
                entry.getTransactionType(),
                entry.getCreatedAt()
        );
    }
}
