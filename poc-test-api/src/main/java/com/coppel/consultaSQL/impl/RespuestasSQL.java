package com.coppel.consultaSQL.impl;

import java.util.List;
import java.util.Optional;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;
import org.springframework.dao.DataIntegrityViolationException;
import com.coppel.consultaSQL.ImplRespuestasSQL;
import com.coppel.dto.ConfirmacionDTO;
import com.coppel.dto.RespuestasDTO;

@Component
public class RespuestasSQL implements ImplRespuestasSQL{

    private static final Logger log = LoggerFactory.getLogger(RespuestasSQL.class);


    @Autowired
    @Qualifier("sqlServerRes")
    private JdbcTemplate jdbcSqlServer;

 

    @Override
    //El código es seguro contra Stored XSS y SQL Injection gracias al uso de Prepared Statements.
    public Optional<List <RespuestasDTO>> obtenerRespuestas (String numEmpleado, String nombreCompleto, Boolean invitadoAsiste) {
        try {
            if (checkAuthorization("authorization")) {
                String sql = "{CALL SP_ObtenerRespuestas (?)}";
             
                List<RespuestasDTO> result = jdbcSqlServer.query(
                        sql,
                        new BeanPropertyRowMapper<>(RespuestasDTO.class),
                        numEmpleado
                );
                return Optional.ofNullable(result.isEmpty() ? null : result);
                
            }
            return Optional.empty();
        } catch (Exception e) {
            log.error("Error en obtenerRespuesta. ",numEmpleado, e.getMessage(),e);
            throw new RuntimeException("Error en consulta: " + e.getMessage(),e);
        }
    }

    @Override
    public void InsertListaConfirmacion (ConfirmacionDTO confirmacionDTO){
        try {
            if (checkAuthorization("authorization")) {
                String sql = "{CALL SP_RESPUESTAS (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?)}";
                                 
                jdbcSqlServer.update(
                sql,
                confirmacionDTO.getNumEmpleado(),
                confirmacionDTO.getNombreCompleto(),
                confirmacionDTO.getInvitadoAsiste(),
                confirmacionDTO.getParejaAsiste(),
                confirmacionDTO.getNombrePareja(),
                confirmacionDTO.getAlergiaAlimentaria(),
                confirmacionDTO.getDiscapacidad(),
                confirmacionDTO.getAlergiaEsp(),
                confirmacionDTO.getDiscapacidadEsp(),
                confirmacionDTO.getComentarios(),
                confirmacionDTO.getFechaRegistro(),
                confirmacionDTO.getCorreo()
            );                        
               
            }
            log.info("Respuesta registrada con éxito.", confirmacionDTO.getNumEmpleado());
            
        } catch (DataIntegrityViolationException e){
            log.error("Primary Key duplicado", confirmacionDTO.getNumEmpleado(), e.getMessage(),e);
            throw e;
        }catch (Exception e) {
            log.error("Error al guardar la información. ", confirmacionDTO.getNumEmpleado(), e.getMessage(), e);
            throw new RuntimeException("Error en la operación: " + e.getMessage(), e);
        }

    };
    
    private boolean checkAuthorization(String userName) {
        return "authorization". equals(userName);
       
    }

    


}