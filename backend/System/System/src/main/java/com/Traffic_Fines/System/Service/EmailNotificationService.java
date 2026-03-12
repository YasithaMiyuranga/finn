package com.Traffic_Fines.System.Service;

import com.Traffic_Fines.System.Dto.EmailNotificationDTO;
import com.Traffic_Fines.System.Entity.Driver;
import com.Traffic_Fines.System.Entity.EmailNotification;
import com.Traffic_Fines.System.Entity.TrafficFine;
import com.Traffic_Fines.System.Repository.DriverRepo;
import com.Traffic_Fines.System.Repository.EmailNotificationRepo;
import com.Traffic_Fines.System.Repository.TrafficFineRepo;
import com.Traffic_Fines.System.Respons.Respons;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class EmailNotificationService {

    @Autowired
    private EmailNotificationRepo emailRepo;

    @Autowired
    private DriverRepo driverRepo;

    @Autowired
    private TrafficFineRepo fineRepo;

    public Respons sendNotification(EmailNotificationDTO dto) {
        Driver driver = driverRepo.findById(dto.getDriverId());
        if (driver == null) {
            return new Respons<>(false, "Invalid driver ID", null);
        }

        EmailNotification notification = new EmailNotification();
        notification.setEmailType(EmailNotification.EmailType.valueOf(dto.getEmailType()));
        notification.setSentAt(LocalDateTime.now());
        notification.setStatus(EmailNotification.EmailStatus.PENDING);
        notification.setEmailContent(dto.getEmailContent());
        notification.setRecipientEmail(dto.getRecipientEmail());
        notification.setDriver(driver);

        if (dto.getFineId() != null) {
            TrafficFine fine = fineRepo.findById(dto.getFineId()).orElse(null);
            notification.setTrafficFine(fine);
        }

        EmailNotification saved = emailRepo.save(notification);

        // TODO: Actual email sending logic here using JavaMailSender
        // For now, just mark as SENT
        saved.setStatus(EmailNotification.EmailStatus.SENT);
        emailRepo.save(saved);

        return new Respons<>(true, "Email notification sent", saved.getId());
    }

    public Respons getDriverNotifications(int driverId) {
        List<EmailNotification> notifications = emailRepo.findByDriverId(driverId);
        return new Respons<>(true, "Notifications retrieved", notifications);
    }

    public Respons getPendingNotifications() {
        List<EmailNotification> notifications = emailRepo.findByStatusOrderBySentAtDesc(
                EmailNotification.EmailStatus.PENDING);
        return new Respons<>(true, "Pending notifications retrieved", notifications);
    }

    public Respons markAsRead(int notificationId) {
        EmailNotification notification = emailRepo.findById(notificationId);
        if (notification == null) {
            return new Respons<>(false, "Invalid notification ID", null);
        }

        notification.setStatus(EmailNotification.EmailStatus.SENT);
        emailRepo.save(notification);
        return new Respons<>(true, "Notification marked as read", notificationId);
    }
}
