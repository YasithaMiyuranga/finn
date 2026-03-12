package com.Traffic_Fines.System.Entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "PendingFine")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PendingFine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pending_id")
    private int id;

    @Column(name = "last_reminder_sent")
    private LocalDate lastReminderSent;

    @Column(name = "oic_review_status", length = 20)
    private String oicReviewStatus;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne
    @JoinColumn(name = "fine_id")
    private TrafficFine fine;
}
