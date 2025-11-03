package ke.co.smartlaundry.repository;

import ke.co.smartlaundry.model.DriverLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; 
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverLocationRepository extends JpaRepository<DriverLocation, Long> {

    @Query(value = """
        SELECT * FROM driver_location dl
        WHERE ST_DWithin(
            dl.location,
            ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
            :radius
        )
        ORDER BY
            ST_Distance(
                dl.location,
                ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
            )
        """, nativeQuery = true)
    List<DriverLocation> findDriversNear(
            @Param("lat") double latitude,
            @Param("lng") double longitude,
            @Param("radius") double radiusMeters
    );

    Optional<DriverLocation> findByDriverId(Long driverId);
}

