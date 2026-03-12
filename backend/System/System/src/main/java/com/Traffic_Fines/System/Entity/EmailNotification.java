package com.Traffic_Fines.System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Email_Notifications")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class EmailNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(name = "email_type", length = 50)
    private EmailType emailType;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private EmailStatus status;

    @Column(name = "email_content", columnDefinition = "TEXT")
    private String emailContent;

    @Column(name = "recipient_email", length = 100)
    private String recipientEmail;

    // Email Types
    public enum EmailType {
        FINE_ISSUED, PAYMENT_REMINDER, FINAL_REMINDER, POINTS_WARNING, SUSPENSION_NOTICE
    }

    // Email Status
    public enum EmailStatus {
        SENT, FAILED, PENDING
    }

    // Relationship with Driver
    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    // Relationship with TrafficFine
    @ManyToOne
    @JoinColumn(name = "fine_id")
    private TrafficFine trafficFine;
}
