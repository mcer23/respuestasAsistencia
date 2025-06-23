
package com.coppel.services.impl;

import java.util.List;
import java.util.Optional;
import java.util.logging.LogManager;

import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import com.coppel.consultaSQL.ImplRespuestasSQL;
import com.coppel.dto.RespuestasDTO;
import com.coppel.models.RespuestasAsistencia;
import com.coppel.repositories.RespuestasRepository;
import com.coppel.services.RespuestasService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
@PropertySource("classpath:application.yaml")
public class ImplRespuestas implements RespuestasService{
    @Autowired
    private ImplRespuestasSQL implRespuestasSQL;
    
    @Override
    public Object consultarLista(String numEmpleado, String nombreCompleto, Boolean invitadoAsiste){
      return this.implRespuestasSQL.obtenerRespuestas(numEmpleado,nombreCompleto,invitadoAsiste);
      
    }

    
};