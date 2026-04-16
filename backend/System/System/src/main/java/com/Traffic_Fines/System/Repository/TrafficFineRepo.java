package com.Traffic_Fines.System.Repository;


import com.Traffic_Fines.System.Entity.TrafficFine;
import org.springframework.data.jpa.repository.JpaRepository;



public interface TrafficFineRepo extends JpaRepository<TrafficFine,Integer>{
    TrafficFine findById(int id);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(f.points) FROM TrafficFine f WHERE f.licenseId = :licenseId AND f.issuedDate >= :startDate")
    Integer sumPointsByLicenseIdAndIssuedDateAfter(String licenseId, java.time.LocalDate startDate);

}

