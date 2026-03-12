package com.Traffic_Fines.System.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "Traffic_Fine")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TrafficFine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fine_id")
    private int id;

    @Column(name = "fine_number", unique = true, length = 20)
    private String fineNumber;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "issue_time")
    private LocalTime issueTime;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "fine_amount")
    private int fineAmount;

    @Column(name = "outstanding_amount")
    private int outstandingAmount;

    @Column(name = "payment_status", length = 20)
    private String paymentStatus;

    @Column(name = "payment_due_date")
    private LocalDate paymentDueDate;

    @Column(name = "is_notification_sent")
    private boolean isNotificationSent;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "officer_id")
    private Police_Officers policeOfficer;

    @ManyToOne
    @JoinColumn(name = "violation_id")
    private ViolationType violationType;

    @OneToMany(mappedBy = "fine", cascade = CascadeType.ALL)
    private List<PendingFine> pendingFines;

    // New relationship for email notifications
    @OneToMany(mappedBy = "trafficFine", cascade = CascadeType.ALL)
    private List<EmailNotification> emailNotifications;
}
