package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Dto.ViolationPointsConfigDTO;
import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.ViolationPointsConfigService;
import com.Traffic_Fines.System.Util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "api/points-config")
@CrossOrigin(origins = "http://localhost:5173/")
public class ViolationPointsConfigController {

    @Autowired
    private ViolationPointsConfigService configService;

    @PostMapping("/save")
    public ResponseEntity<Respons<?>> saveConfig(@RequestBody ViolationPointsConfigDTO dto) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(dto);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new Respons<>(false, "Validation failed", errors));
            }
            return ResponseEntity.ok(configService.saveConfig(dto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error saving config", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<Respons<?>> getAllConfigs() {
        try {
            return ResponseEntity.ok(configService.getAllConfigs());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error retrieving configs", e.getMessage()));
        }
    }

    @GetMapping("/violation/{violationTypeId}")
    public ResponseEntity<Respons<?>> getPointsForViolation(@PathVariable int violationTypeId) {
        try {
            return ResponseEntity.ok(configService.getPointsForViolation(violationTypeId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error retrieving config", e.getMessage()));
        }
    }

    @PutMapping("/update/{configId}")
    public ResponseEntity<Respons<?>> updateConfig(@PathVariable int configId,
            @RequestBody ViolationPointsConfigDTO dto) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(dto);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new Respons<>(false, "Validation failed", errors));
            }
            return ResponseEntity.ok(configService.updateConfig(configId, dto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new Respons<>(false, "Error updating config", e.getMessage()));
        }
    }
}
