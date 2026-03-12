package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.DriverPointsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "api/points")
@CrossOrigin(origins = "http://localhost:5173/")
public class DriverPointsController {

    @Autowired
    private DriverPointsService pointsService;

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<Respons<?>> getDriverPoints(@PathVariable int driverId) {
        try {
            return ResponseEntity.ok(pointsService.getDriverPoints(driverId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error retrieving points", e.getMessage()));
        }
    }

    @PostMapping("/add/{driverId}/{points}")
    public ResponseEntity<Respons<?>> addPoints(@PathVariable int driverId, @PathVariable int points) {
        try {
            return ResponseEntity.ok(pointsService.addPoints(driverId, points));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error adding points", e.getMessage()));
        }
    }

    @GetMapping("/approaching-suspension")
    public ResponseEntity<Respons<?>> getDriversApproachingSuspension() {
        try {
            return ResponseEntity.ok(pointsService.getDriversApproachingSuspension());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error retrieving data", e.getMessage()));
        }
    }

    @PutMapping("/reset/{driverId}")
    public ResponseEntity<Respons<?>> resetPoints(@PathVariable int driverId) {
        try {
            return ResponseEntity.ok(pointsService.resetPoints(driverId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error resetting points", e.getMessage()));
        }
    }
}
