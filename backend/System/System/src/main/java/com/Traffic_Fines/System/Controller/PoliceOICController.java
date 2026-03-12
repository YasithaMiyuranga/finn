package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Dto.PoliceOICDTO;
import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.PoliceOICService;
import com.Traffic_Fines.System.Util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping(value = "api/police_OIC")
@CrossOrigin
public class PoliceOICController {

    @Autowired
    private PoliceOICService policeOICService;

    @GetMapping("/getPoliceOIC")
    public ResponseEntity<Respons<?>> getAllPoliceOICs() {
        try {
            return ResponseEntity.ok(new Respons<>(true, "all Police OICs", policeOICService.getAllPoliceOICs()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "oic mokuth n", e.getMessage()));
        }
    }

    @PostMapping("/savePoliceOIC")
    public ResponseEntity<Respons<?>> savePoliceOlC(@RequestBody PoliceOICDTO policeOICDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(policeOICDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "saved Police_OIC add", policeOICService.savePoliceOlC(policeOICDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }

    @PutMapping("/updatePoliceOIC/{id}")
    public ResponseEntity<Respons<?>> updatePoliceOIC(@PathVariable int id, @RequestBody PoliceOICDTO policeOICDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(policeOICDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "update Police_OIC", policeOICService.updatePoliceOIC(id, policeOICDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "mokth n updt", e.getMessage()));
        }
    }

    @DeleteMapping("/deletePoliceOIC/{id}")
    public ResponseEntity<Respons<?>> deletePoliceOIC(@PathVariable int id) {
        try {
            return ResponseEntity.ok(new Respons<>(true, "delete police_officers", policeOICService.deletePoliceOIC(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }
}






