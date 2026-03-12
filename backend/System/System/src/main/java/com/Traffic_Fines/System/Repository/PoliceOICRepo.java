package com.Traffic_Fines.System.Repository;

import com.Traffic_Fines.System.Entity.PoliceOIC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PoliceOICRepo extends JpaRepository<PoliceOIC,Integer>{
    PoliceOIC findById(int id);
    @Query("SELECT p FROM PoliceOIC p WHERE p.user.id = :id")
    PoliceOIC findByUser(@Param("id") int id);
}
