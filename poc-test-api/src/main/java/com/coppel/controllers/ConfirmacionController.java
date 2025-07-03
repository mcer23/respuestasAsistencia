package com.coppel.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coppel.dto.ConfirmacionDTO;
import com.coppel.services.RespuestasService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@CrossOrigin (origins = "https://localhost:4200")
@RestController
@RequestMapping ("/respuestasConvencionNacional")
public class ConfirmacionController {

    @Autowired
    private RespuestasService respuestasService;

    @PostMapping(
        value = "/guardarRespuestasv2",
        consumes = "application/json",
        produces = "application/json"
    )
    public String guardarRespuestasv2(
        @RequestBody ConfirmacionDTO request
    ){
        respuestasService.InsetListaConfirmacion(request);
        System.out.println("V2 aceptado"+request);
        return "{\"status\":\"success\"}";
    }
    
    @GetMapping("/pru")
    public String getMethodName() {
        return "hOLA";
    }
    
}
