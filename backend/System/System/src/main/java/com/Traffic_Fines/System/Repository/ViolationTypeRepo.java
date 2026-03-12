package com.Traffic_Fines.System.Repository;


import com.Traffic_Fines.System.Entity.ViolationType;
import org.springframework.data.jpa.repository.JpaRepository;



public interface ViolationTypeRepo extends JpaRepository<ViolationType,Integer>{
    ViolationType findById(int id);

}

