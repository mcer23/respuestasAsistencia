package com.coppel.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.coppel.dto.ApiResponseDTO;
import com.coppel.dto.FacturasDTO;
import com.coppel.dto.FacturasDetalleDTO;
import com.coppel.dto.RespuestasDTO;
import com.coppel.models.RespuestasAsistencia;
import com.coppel.repositories.RespuestasRepository;
import com.coppel.services.RespuestasService;
import com.coppel.util.Meta;

@RestController
@RequestMapping("/api/respuestasConvencionNacional")
@CrossOrigin (origins="http://localhost:4200")

public class RespuestasController {

    @Autowired /* proporciona al controlador el UserService necesario.*/
    private RespuestasRepository RespuestasRepository;
    private static final String MESSAGE_BAD_REQUEST = "La información que envió no tiene el formato correcto.";
    private final Meta meta = new Meta(UUID.randomUUID().toString(), "OK", 200);

    /*private boolean mostrarRespuestas(RespuestasDTO respuestasDTO) {
        boolean mostrar = true;
        if (respuestasDTO == null) {
            mostrar = false;
        } else if (respuestasDTO.getFacturaDetalleList() == null) {
            mostrar = false;
        } else if (respuestasDTO.getFacturaDetalleList().size() > 0) {
            for (FacturasDetalleDTO detalle : facturasDTO.getFacturaDetalleList()) {
                if (detalle.getIdtFactura() == null) {
                    mostrar = false;
                    break;
                }
            }
        }
        return mostrar;
    }*/

    @GetMapping("/obtener") /* enruta la solicitud al método correcto. */
    /*public List<RespuestasAsistencia> obtenerRespuestas(){
        return RespuestasRepository.findAll();
    }*/
    public RespuestasDTO obtenerRespuestas(){
        return new RespuestasDTO();
    }



    @PostMapping
    public RespuestasAsistencia guardarRespuestas(@RequestBody RespuestasAsistencia respuestas) {
        return RespuestasRepository.save(respuestas);
    }
    
}
