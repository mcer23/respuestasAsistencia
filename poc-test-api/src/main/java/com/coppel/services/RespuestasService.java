package com.coppel.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.coppel.dto.RespuestasDTO;
import com.coppel.models.RespuestasAsistencia;
import com.coppel.repositories.RespuestasRepository;

@Service
public class RespuestasService{

     private final RespuestasRepository respuestasRepository;
     
     
     public RespuestasDTO guardarRespuestas() {
         RespuestasAsistencia entity = respuestasMapper.toEntity(respuestasDTO);
         RespuestasAsistencia savedEntity = respuestasRepository.save(entity);
         return respuestasMapper.toDo(savedEntity);
     }
     public List<RespuestasDTO> obtenerRespuestas() {
         List<RespuestasAsistencia> entities = respuestasRepository.findAll();
         return respuestasMapper.toDtoList(entities);
     }
    
};
 public static void main (String[] args) {
        String mensaje = "Hola, mundo!";
        int numero = 42;
        double decimal = 3.14;
        char letra = 'A';
        boolean esVerdadero = true;

            System.out.println(mensaje);
    }
     
