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
@RequestMapping(value = "api/Driver")
@CrossOrigin(origins = "http://localhost:5173/")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @GetMapping("/getDrivers")
    public ResponseEntity<Respons<?>> getAllDrivers() {
        try {
            return ResponseEntity.ok(new Respons<>(true, "all Police OICs", driverService.getAllDrivers()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "oic mokuth n", e.getMessage()));
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
}






