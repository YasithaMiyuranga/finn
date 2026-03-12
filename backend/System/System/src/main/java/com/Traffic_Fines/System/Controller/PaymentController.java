package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Dto.PaymentDTO;

import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.PaymentService;
import com.Traffic_Fines.System.Util.ValidationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;



@RestController
@RequestMapping(value = "api/payment")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/getPayment")
    public ResponseEntity<Respons<?>> getAllPayment() {
        try {
            return ResponseEntity.ok(new Respons<>(true, "all Payment", paymentService.getAllPayment()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "oic mokuth n", e.getMessage()));
        }
    }

    @PostMapping("/savePayment")
    public ResponseEntity<Respons<?>> savePayment(@RequestBody PaymentDTO paymentDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(paymentDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "saved Payment add", paymentService.savePayment(paymentDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }

    @PutMapping("/updatePayment/{id}")
    public ResponseEntity<Respons<?>> updatePayment(@PathVariable int id, @RequestBody PaymentDTO paymentDTO) {
        try {
            Map<String, String> errors = ValidationUtil.validateObject(paymentDTO);
            if (!errors.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Input Validation failed", errors));
            }
            return ResponseEntity.ok(new Respons<>(true, "update Payment", paymentService.updatePayment(id, paymentDTO)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "mokth n updt", e.getMessage()));
        }
    }

    @DeleteMapping("/deletePayment/{id}")
    public ResponseEntity<Respons<?>> deletePayment(@PathVariable int id) {
        try {
            return ResponseEntity.ok(new Respons<>(true, "delete Payment", paymentService.deletePayment(id)));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "", e.getMessage()));
        }
    }
}


