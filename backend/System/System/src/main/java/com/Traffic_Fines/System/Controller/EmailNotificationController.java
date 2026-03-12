package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Dto.EmailNotificationDTO;
import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.EmailNotificationService;
import com.Traffic_Fines.System.Util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "api/notifications")
@CrossOrigin(origins = "http://localhost:5173/")
public class EmailNotificationController {

    @Autowired
    private EmailNotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<Respons<?>> sendNotification(@RequestBody EmailNotificationDTO dto) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(dto);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new Respons<>(false, "Validation failed", errors));
            }
            return ResponseEntity.ok(notificationService.sendNotification(dto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error sending notification", e.getMessage()));
        }
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<Respons<?>> getDriverNotifications(@PathVariable int driverId) {
        try {
            return ResponseEntity.ok(notificationService.getDriverNotifications(driverId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error retrieving notifications", e.getMessage()));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<Respons<?>> getPendingNotifications() {
        try {
            return ResponseEntity.ok(notificationService.getPendingNotifications());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error retrieving pending notifications", e.getMessage()));
        }
    }

    @PutMapping("/mark-read/{notificationId}")
    public ResponseEntity<Respons<?>> markAsRead(@PathVariable int notificationId) {
        try {
            return ResponseEntity.ok(notificationService.markAsRead(notificationId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error updating notification", e.getMessage()));
        }
    }
}
