package com.Traffic_Fines.System.Repository;


import com.Traffic_Fines.System.Entity.TrafficFine;
import org.springframework.data.jpa.repository.JpaRepository;



public interface TrafficFineRepo extends JpaRepository<TrafficFine,Integer>{
    TrafficFine findById(int id);

}

