package com.coppel.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coppel.dto.ConfirmacionDTO;
import com.coppel.services.RespuestasService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;



@CrossOrigin (origins = "http://localhost:4200")
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

    public ResponseEntity <?> guardarRespuestasv2(
        @RequestBody ConfirmacionDTO request
    ){
        try{
            respuestasService.InsertListaConfirmacion(request);
            System.out.println("V2 aceptado: "+request);
            // You can return a more specific success object if needed
            return new ResponseEntity<>("{\"status\":\"success\", \"message\":\"Respuestas guardadas exitosamente.\"}", HttpStatus.OK);
        } catch (DataIntegrityViolationException e){
            System.err.println("Error: Primary key duplicado"+ e.getMessage());
            // Mensaje para mostrarse en el front
            String errorMsg = "{\"status\":\"error\", \"message\":\"Ya existe una respuesta con la misma clave. Por favor, verifica los datos.\"}";
            return new ResponseEntity<>(errorMsg, HttpStatus.CONFLICT); //409
        } catch(Exception e){
            // Cuando el error es 500
            System.err.println("Error 500 " + e.getClass().getName()+"Mensaje: "+e.getMessage());
            e.printStackTrace();

            String errorMsg = "{\"status\":\"error\", \"message\":\"Ya existe una respuesta con la misma clave. Por favor, verifica los datos.\"}";

            return new ResponseEntity<>(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/pru")
    public String getMethodName() {
        return "hOLA";
    }

    
}
