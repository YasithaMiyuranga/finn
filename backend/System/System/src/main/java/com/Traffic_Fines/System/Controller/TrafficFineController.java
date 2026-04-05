package com.Traffic_Fines.System.Controller;



import com.Traffic_Fines.System.Dto.TrafficFineDTO;


import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.TrafficFineService;
import com.Traffic_Fines.System.Util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;



@RestController
@CrossOrigin
@RequestMapping(value = "/api/traffic_fine")
public class TrafficFineController {

    @Autowired
    private TrafficFineService trafficFineService;

    @GetMapping("/getTrafficFine")
    public ResponseEntity<Respons<?>> getAlltrafficFine() {
        try {
            return ResponseEntity.ok(new Respons<>(true, "all Traffic Fine", trafficFineService.getAllTrafficFines()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "oic mokuth n", e.getMessage()));
        }
    }

    @PostMapping("/saveTrafficFine")
    public ResponseEntity<Respons<?>> saveTrafficFine(@RequestBody TrafficFineDTO trafficFineDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(trafficFineDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(trafficFineService.saveTrafficFine(trafficFineDTO));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }

    @PutMapping("/updateTrafficFine/{id}")
    public ResponseEntity<Respons<?>> updateTrafficFine(@PathVariable int id, @RequestBody TrafficFineDTO trafficFineDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(trafficFineDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "update Traffic Fine", trafficFineService.updateTrafficFine(id, trafficFineDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "mokth n updt", e.getMessage()));
        }
    }

    @DeleteMapping("/deleteTrafficFine/{id}")
    public ResponseEntity<Respons<?>> deleteTrafficFine(@PathVariable int id) {
        try {
            return ResponseEntity.ok(new Respons<>(true, "delete Traffic Fine", trafficFineService.deleteTrafficFine(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }
}


