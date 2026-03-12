package com.Traffic_Fines.System.Repository;
import com.Traffic_Fines.System.Entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DriverRepo extends JpaRepository<Driver,Integer> {
    Driver findById(int id);
    @Query("SELECT p FROM Driver p WHERE p.user.id = :id")
    Driver findByUser(@Param("id") int id);
}