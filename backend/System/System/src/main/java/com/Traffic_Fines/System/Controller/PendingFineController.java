package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Dto.PendingFineDTO;

import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.PendingFineService;
import com.Traffic_Fines.System.Util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;



@RestController
@RequestMapping(value = "api/PendingFine")
@CrossOrigin
public class PendingFineController {

    @Autowired
    private PendingFineService pendingFineService;

    @GetMapping("/getPendingFine")
    public ResponseEntity<Respons<?>> getAllPendingFine() {
        try {
            return ResponseEntity.ok(new Respons<>(true, "all Pending Fine", pendingFineService.getAllPendingFine()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "oic mokuth n", e.getMessage()));
        }
    }

    @PostMapping("/savePendingFine")
    public ResponseEntity<Respons<?>> savePendingFine(@RequestBody PendingFineDTO pendingFineDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(pendingFineDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "saved Pending Fine add", pendingFineService.savePendingFine(pendingFineDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }

    @PutMapping("/updatePendingFine/{id}")
    public ResponseEntity<Respons<?>> updatePendingFine(@PathVariable int id, @RequestBody PendingFineDTO pendingFineDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(pendingFineDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "update Pending Fine", pendingFineService.updatePendingFine(id, pendingFineDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "mokth n updt", e.getMessage()));
        }
    }

    @DeleteMapping("/deletePendingFine/{id}")
    public ResponseEntity<Respons<?>> deletePendingFine(@PathVariable int id) {
        try {
            return ResponseEntity.ok(new Respons<>(true, "delete Pending Fine", pendingFineService.deletePendingFine(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }
}


