package com.Traffic_Fines.System.Repository;

import com.Traffic_Fines.System.Entity.PendingFine;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PendingFineRepo extends JpaRepository<PendingFine,Integer>{
    PendingFine findById(int id);

}