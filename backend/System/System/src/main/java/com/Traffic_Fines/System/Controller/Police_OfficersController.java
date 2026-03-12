package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Dto.Police_OfficersDTO;
import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.Police_OfficersService;
import com.Traffic_Fines.System.Util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping(value = "api/police_officers")
@CrossOrigin
public class Police_OfficersController {

    @Autowired
    private Police_OfficersService policeOfficersService;

    @GetMapping("/getPoliceOfficers")
    public ResponseEntity<Respons<?>> getAllPolice_Officers() {
        try {
            return ResponseEntity.ok(new Respons<>(true, "all police_officers", policeOfficersService.getAllPolice_Officers()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "oficer mokuth n", e.getMessage()));
        }
    }

    @PostMapping("/savePoliceOfficer")
    public ResponseEntity<Respons<?>> savePoliceOfficer(@RequestBody Police_OfficersDTO police_officersDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(police_officersDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "saved Police_Officers add", policeOfficersService.savePoliceOfficer(police_officersDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }

    @PutMapping("/updatePoliceOfficer/{id}")
    public ResponseEntity<Respons<?>> updatePolice_Officers(@PathVariable int id, @RequestBody Police_OfficersDTO police_officersDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(police_officersDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "update Police_Officers", policeOfficersService.updatePolice_Officers(id, police_officersDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "mokth n updt", e.getMessage()));
        }
    }

    @DeleteMapping("/deletePoliceOfficer/{id}")
    public ResponseEntity<Respons<?>> deletePolice_Officers(@PathVariable int id) {
        try {
            return ResponseEntity.ok(new Respons<>(true, "delete police_officers", policeOfficersService.deletePolice_Officers(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }
}






