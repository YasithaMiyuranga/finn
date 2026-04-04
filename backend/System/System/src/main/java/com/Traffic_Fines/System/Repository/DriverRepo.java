package com.Traffic_Fines.System.Repository;
import com.Traffic_Fines.System.Entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

public interface DriverRepo extends JpaRepository<Driver, Integer> {
    Driver findById(int id);

    @Query("SELECT p FROM Driver p WHERE p.user.id = :id")
    Driver findByUser(@Param("id") int id);

    Driver findByLicenseNumber(int licenseNumber);

    // Total registered drivers
    long countBy();

    // Registered in last 7 days
    @Query("SELECT COUNT(d) FROM Driver d WHERE d.registeredDate >= :since")
    long countByRegisteredDateAfter(@Param("since") LocalDate since);

    // Registered in last calendar month (month-1)
    @Query("SELECT COUNT(d) FROM Driver d WHERE MONTH(d.registeredDate) = :month AND YEAR(d.registeredDate) = :year")
    long countByLastMonth(@Param("month") int month, @Param("year") int year);

    // Registered in last year (year-1)
    @Query("SELECT COUNT(d) FROM Driver d WHERE YEAR(d.registeredDate) = :year")
    long countByYear(@Param("year") int year);

    // Monthly counts for chart (by month + year)
    @Query("SELECT COUNT(d) FROM Driver d WHERE MONTH(d.registeredDate) = :month AND YEAR(d.registeredDate) = :year")
    long countByMonthAndYear(@Param("month") int month, @Param("year") int year);
}