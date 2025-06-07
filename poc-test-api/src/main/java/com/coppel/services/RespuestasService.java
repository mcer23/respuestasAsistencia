package com.coppel.services;

import java.util.List;
import java.util.Optional;
import java.util.logging.LogManager;

import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import com.coppel.consultaSQL.impl.ImplRespuestasSQL;
import com.coppel.dto.RespuestasDTO;
import com.coppel.models.RespuestasAsistencia;
import com.coppel.repositories.RespuestasRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class RespuestasService implements ImplRespuestas{
    @Autowired
    private ImplRespuestasSQL implRespuestasSQL;

    private static final Logger logger = LogManager.getLogger(RespuestasService.class);

    @Override
    public Object consultarList(String numEmpleado, String nombreCompleto, Boolean invitadoAsiste){
        try{
            logger.info("Inicio de la consulta de respuestas");

            Optional<List<RespuestaDTO>> consultarLista = implRespuestasSQL.consultarLista(numEmpleado, nombreCompleto, invitadoAsiste);

            if (consultarLista.isPresent()){
                List<RespuestasDTO> respuestasList = consultarLista.get();

                respuestasList.forEach(respuestasdto ->{ ObjectNode respuestasNode= objectMapper.createObjectNode();
                    respuestasNode.put("id", respuestasdto.getIdRespuestas());
                    respuestasNode.put("numEmpleado", respuestasdto.getNumEmpleado());
                    respuestasNode.put("nombreCompleto", respuestasdto.getNombreCompleto());
                    respuestasNode.put("invitadoAsiste", respuestasdto.getInvitadoAsiste());
                });

            }
            respuestasJSON.set("Respuestas", RespuestasArray);
            return objectMapper.writeValueString(respuestasJSON);
        } catch (Exception e) {
            logger.error("Error al consultar la lista de respuestas", e);
            throw new RuntimeException("Error al consultar la lista de respuestas", e);
        }
    }

    
};

     
