package com.Traffic_Fines.System.Controller;

import com.Traffic_Fines.System.Dto.PoliceOICDTO;
import com.Traffic_Fines.System.Respons.Respons;
import com.Traffic_Fines.System.Service.PoliceOICService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/police_oic")
@CrossOrigin
public class PoliceOICController {

    @Autowired
    private PoliceOICService policeOICService;

    @PostMapping("/savePoliceOIC")
    public Respons<Integer> savePoliceOIC(@RequestBody PoliceOICDTO policeOICDTO) {
        return policeOICService.savePoliceOIC(policeOICDTO);
    }

    @GetMapping("/getPoliceOICs")
    public List<PoliceOICDTO> getPoliceOICs() {
        return policeOICService.getAllPoliceOICs();
    }

    @DeleteMapping("/deletePoliceOIC/{id}")
    public Respons<Integer> deletePoliceOIC(@PathVariable int id) {
        return policeOICService.deletePoliceOIC(id);
    }

    @PutMapping("/updatePoliceOIC/{id}")
    public Respons<Integer> updatePoliceOIC(@PathVariable int id, @RequestBody PoliceOICDTO policeOICDTO) {
        return policeOICService.updatePoliceOIC(id, policeOICDTO);
    }
}
