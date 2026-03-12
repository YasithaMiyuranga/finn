package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Dto.PoliceOICDTO;
import com.Traffic_Fines.System.Dto.TrafficFineDTO;
import com.Traffic_Fines.System.Dto.ViolationTypeDTO;
import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.ViolationTypeService;
import com.Traffic_Fines.System.Util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(value = "api/Violation")
@CrossOrigin
public class ViolationTypeController {

    @Autowired
    private ViolationTypeService violationTypeService;

    @GetMapping ("/getViolationTypes")
    public ResponseEntity<Respons<?>> getViolationType(){
        try{
            return ResponseEntity.ok(new Respons<>(true,"all violation Type",violationTypeService.getAllViolationType()));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false,"mokuth user",e.getMessage()));
        }
    }

    @PostMapping("/saveViolationTypes")
    public ResponseEntity<Respons<?>> saveViolationType(@RequestBody ViolationTypeDTO violationTypeDTO){
        try{
            Map<String, String> errors = ValidationUtil.validateObject(violationTypeDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>( false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true,"saved violation Type",violationTypeService.saveViolationType(violationTypeDTO)));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false,".....",e.getMessage()));
        }
    }


















    @PutMapping("/updateViolationTypes/{id}")
    public ResponseEntity<Respons<?>> updateViolationType(@PathVariable int id,@RequestBody ViolationTypeDTO violationTypeDTO){
        try{
            Map<String, String> errors = ValidationUtil.validateObject(violationTypeDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>( false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true,"update violation Type",violationTypeService.updateViolationType(id,violationTypeDTO)));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false,",,,,,,,,,,",e.getMessage()));
        }
    }

    @DeleteMapping("/deleteViolationTypes/{id}")
    public ResponseEntity<Respons<?>> deleteViolationType(@PathVariable int id){
        try{
            return ResponseEntity.ok(new Respons<>(true,"delete violation Type",violationTypeService.deleteViolationType(id)));
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false,"////",e.getMessage()));
        }
    }
}





