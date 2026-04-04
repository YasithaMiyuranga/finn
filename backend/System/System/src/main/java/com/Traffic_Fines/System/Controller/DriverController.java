package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Dto.DriverDTO;
import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.DriverService;
import com.Traffic_Fines.System.Util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/Driver")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @GetMapping("/getDrivers")
    public ResponseEntity<Respons<?>> getAllDrivers() {
        try {
            java.util.List<java.util.Map<String, Object>> drivers = driverService.getAllDrivers();
            return ResponseEntity.ok(new Respons<>(true, "all drivers", drivers));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Error fetching drivers", e.getMessage()));
        }
    }

    @PostMapping("/saveDriver")
    public ResponseEntity<Respons<?>> saveDriver(@RequestBody DriverDTO driverDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(driverDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "saved Driver add", driverService.saveDriver(driverDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }

    @PutMapping("/updateDriver/{id}")
    public ResponseEntity<Respons<?>> updateDriver(@PathVariable int id, @RequestBody DriverDTO driverDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(driverDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "update driver", driverService.updateDriver(id, driverDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "mokth n updt", e.getMessage()));
        }
    }

    @DeleteMapping("/deleteDriver/{id}")
    public ResponseEntity<Respons<?>> deleteDriver(@PathVariable int id) {
        try {
            return ResponseEntity.ok(new Respons<>(true, "delete police_officers", driverService.deleteDriver(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }

    @GetMapping("/getDriverByUserId/{userId}")
    public ResponseEntity<Respons<?>> getDriverByUserId(@PathVariable int userId) {
        try {
            return ResponseEntity.ok(new Respons<>(true, "Driver found", driverService.getDriverByUserId(userId)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Driver not found", e.getMessage()));
        }
    }

    @GetMapping("/getByLicense/{licenseNumber}")
    public ResponseEntity<Respons<?>> getDriverByLicense(@PathVariable String licenseNumber) {
        try {
            int license = Integer.parseInt(licenseNumber);
            return ResponseEntity.ok(new Respons<>(true, "Driver found", driverService.getDriverByLicense(license)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Driver not found", e.getMessage()));
        }
    }

    @GetMapping("/getStats")
    public ResponseEntity<Respons<?>> getDriverStats() {
        try {
            return ResponseEntity.ok(new Respons<>(true, "driver stats", driverService.getDriverStats()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Error fetching stats", e.getMessage()));
        }
    }

    @GetMapping("/getMonthlyChart")
    public ResponseEntity<Respons<?>> getMonthlyChart() {
        try {
            return ResponseEntity.ok(new Respons<>(true, "monthly chart", driverService.getMonthlyChartData()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Error fetching chart", e.getMessage()));
        }
    }
}






