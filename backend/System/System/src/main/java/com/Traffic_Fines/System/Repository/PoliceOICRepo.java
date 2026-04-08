package com.Traffic_Fines.System.Repository;

import com.Traffic_Fines.System.Entity.PoliceOIC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PoliceOICRepo extends JpaRepository<PoliceOIC, Integer> {
}
