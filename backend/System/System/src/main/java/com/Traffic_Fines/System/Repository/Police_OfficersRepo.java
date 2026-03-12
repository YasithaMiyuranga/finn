package com.Traffic_Fines.System.Repository;
import com.Traffic_Fines.System.Entity.Police_Officers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface Police_OfficersRepo extends JpaRepository<Police_Officers,Integer> {
    Police_Officers findById(int id);
    @Query("SELECT p FROM Police_Officers p WHERE p.user.id = :id")
    Police_Officers findByUser(@Param("id") int id);
}
