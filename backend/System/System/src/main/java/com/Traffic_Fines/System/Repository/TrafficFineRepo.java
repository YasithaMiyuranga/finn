package com.Traffic_Fines.System.Repository;


import com.Traffic_Fines.System.Entity.TrafficFine;
import org.springframework.data.jpa.repository.JpaRepository;



public interface TrafficFineRepo extends JpaRepository<TrafficFine,Integer>{
    TrafficFine findById(int id);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(f.points) FROM TrafficFine f WHERE f.licenseId = :licenseId AND f.issuedDate >= :startDate")
    Integer sumPointsByLicenseIdAndIssuedDateAfter(String licenseId, java.time.LocalDate startDate);

    java.util.List<TrafficFine> findByLicenseId(String licenseId);

    long countByPoliceId(String policeId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(f.totalAmount) FROM TrafficFine f WHERE f.policeId = :policeId")
    Double sumAmountByPoliceId(String policeId);

    long countByLicenseIdAndStatus(String licenseId, String status);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(f.totalAmount) FROM TrafficFine f WHERE f.licenseId = :licenseId AND f.status = :status")
    Double sumAmountByLicenseIdAndStatus(String licenseId, String status);

    long countByLicenseId(String licenseId);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(f.totalAmount) FROM TrafficFine f WHERE f.licenseId = :licenseId")
    Double sumAmountByLicenseId(String licenseId);

}

