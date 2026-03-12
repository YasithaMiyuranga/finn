package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Dto.GrievanceReportDTO;
import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.GrievanceReportService;
import com.Traffic_Fines.System.Util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "api/grievance")
@CrossOrigin(origins = "http://localhost:5173/")
public class GrievanceReportController {

    @Autowired
    private GrievanceReportService grievanceService;

    @PostMapping("/submit")
    public ResponseEntity<Respons<?>> submitGrievance(@RequestBody GrievanceReportDTO dto) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(dto);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new Respons<>(false, "Validation failed", errors));
            }
            return ResponseEntity.ok(grievanceService.submitGrievance(dto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error submitting grievance", e.getMessage()));
        }
    }

    @GetMapping("/my-reports/{driverId}")
    public ResponseEntity<Respons<?>> getMyGrievances(@PathVariable int driverId) {
        try {
            return ResponseEntity.ok(grievanceService.getMyGrievances(driverId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error retrieving grievances", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<Respons<?>> getAllGrievances() {
        try {
            return ResponseEntity.ok(grievanceService.getAllGrievances());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error retrieving all grievances", e.getMessage()));
        }
    }

    @PutMapping("/update-status/{grievanceId}")
    public ResponseEntity<Respons<?>> updateGrievanceStatus(@PathVariable int grievanceId,
            @RequestParam String status,
            @RequestParam(required = false) String resolution) {
        try {
            return ResponseEntity.ok(grievanceService.updateGrievanceStatus(grievanceId, status, resolution));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error updating status", e.getMessage()));
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<Respons<?>> getPendingGrievances() {
        try {
            return ResponseEntity.ok(grievanceService.getPendingGrievances());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error retrieving pending grievances", e.getMessage()));
        }
    }
}
