package com.Traffic_Fines.System.Repository;

import com.Traffic_Fines.System.Entity.EmailNotification;
import com.Traffic_Fines.System.Entity.EmailNotification.EmailStatus;
import com.Traffic_Fines.System.Entity.EmailNotification.EmailType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EmailNotificationRepo extends JpaRepository<EmailNotification, Integer> {

    // Custom findById method
    EmailNotification findById(int id);

    // Find notifications by driver ID
    @Query("SELECT en FROM EmailNotification en WHERE en.driver.id = :driverId ORDER BY en.sentAt DESC")
    List<EmailNotification> findByDriverId(@Param("driverId") int driverId);

    // Find notifications by fine ID
    @Query("SELECT en FROM EmailNotification en WHERE en.trafficFine.id = :fineId ORDER BY en.sentAt DESC")
    List<EmailNotification> findByFineId(@Param("fineId") int fineId);

    // Find pending notifications (to be sent)
    List<EmailNotification> findByStatusOrderBySentAtDesc(EmailStatus status);

    // Find notifications by email type
    List<EmailNotification> findByEmailTypeOrderBySentAtDesc(EmailType emailType);
}
