package com.Traffic_Fines.System.Controller;



import com.Traffic_Fines.System.Dto.TrafficFineDTO;


import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.TrafficFineService;
import com.Traffic_Fines.System.Service.TrafficFineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import com.Traffic_Fines.System.Util.ValidationUtil;



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
            e.printStackTrace(); // This will help identify the error in server logs
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new Respons<>(false, "Error fetching fines: " + e.getMessage(), e.toString()));
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

    @PutMapping("/pay-fine/{id}")
    public ResponseEntity<Respons<?>> payFine(@PathVariable int id) {
        return ResponseEntity.ok(trafficFineService.payFine(id));
    }

    @GetMapping("/payment-params/{refNo}")
    public ResponseEntity<Respons<Map<String, Object>>> getPaymentParams(@PathVariable int refNo) {
        return trafficFineService.getTrafficFineById(refNo).map(fine -> {
            String merchantId = "1235181";
            String merchantSecret = "NDk1NjEyNDM3MzIxMzM5MDAzNDI1NjAxNzUwNDgyOTI5NjQxNTUy";
            String currency = "LKR";
            String amount = String.format("%.2f", fine.getTotalAmount());
            String orderId = String.valueOf(fine.getRefNo());

            String hash = generatePayHereHash(merchantId, orderId, amount, currency, merchantSecret);

            Map<String, Object> params = new HashMap<>();
            params.put("merchantId", merchantId);
            params.put("orderId", orderId);
            params.put("amount", fine.getTotalAmount());
            params.put("currency", currency);
            params.put("hash", hash);
            params.put("fineDetails", fine);

            return ResponseEntity.ok(new Respons<>(true, "Payment parameters generated", params));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(new Respons<>(false, "Fine not found", null)));
    }

    private String generatePayHereHash(String merchantId, String orderId, String amount, String currency, String merchantSecret) {
        String secretHash = getMd5(merchantSecret).toUpperCase();
        String mainString = merchantId + orderId + amount + currency + secretHash;
        return getMd5(mainString).toUpperCase();
    }

    private String getMd5(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : messageDigest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/driver-points/{licenseId}")
    public ResponseEntity<Respons<Integer>> getDriverPoints(@PathVariable String licenseId) {
        int points = trafficFineService.getDriverPointsInLast7Days(licenseId);
        return ResponseEntity.ok(new Respons<>(true, "Driver points fetched successfully", points));
    }

    @GetMapping("/driver-fines/{licenseId}")
    public ResponseEntity<Respons<java.util.List<com.Traffic_Fines.System.Entity.TrafficFine>>> getFinesByDriver(@PathVariable String licenseId) {
        return ResponseEntity.ok(new Respons<>(true, "Driver fines fetched successfully", trafficFineService.getFinesByLicenseId(licenseId)));
    }

    @GetMapping("/officer-performance/{policeId}")
    public ResponseEntity<Respons<java.util.Map<String, Object>>> getOfficerPerformance(@PathVariable String policeId) {
        return ResponseEntity.ok(new Respons<>(true, "Officer performance fetched successfully", trafficFineService.getOfficerPerformance(policeId)));
    }

    @GetMapping("/driver-stats/{licenseId}")
    public ResponseEntity<Respons<java.util.Map<String, Object>>> getDriverStats(@PathVariable String licenseId) {
        return ResponseEntity.ok(new Respons<>(true, "Driver statistics fetched successfully", trafficFineService.getDriverStats(licenseId)));
    }
}


