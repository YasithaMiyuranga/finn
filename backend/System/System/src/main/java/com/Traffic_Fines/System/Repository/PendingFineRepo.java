package com.Traffic_Fines.System.Repository;

import com.Traffic_Fines.System.Entity.PendingFine;
import com.Traffic_Fines.System.Entity.TrafficFine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface PendingFineRepo extends JpaRepository<PendingFine,Integer>{
    PendingFine findById(int id);
    Optional<PendingFine> findByFine(TrafficFine fine);
}