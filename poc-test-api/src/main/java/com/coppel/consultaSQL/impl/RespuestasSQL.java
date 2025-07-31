package com.coppel.consultaSQL.impl;

import java.util.List;
import java.util.Optional;

import javax.management.RuntimeErrorException;

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

    // private final ConfirmacionController confirmacionController;
    @Autowired
    @Qualifier("sqlServerRes") // Este nombre debe coincidir con el del Bean: el bean de SqlServerConfig es sqlServerRespuestasDataSource
    private JdbcTemplate jdbcSqlServer;

    /* private static Logger log = LoggerFactory.getLogger(RespuestasSQL.class);
    RespuestasSQL(ConfirmacionController confirmacionController) {
        this.confirmacionController = confirmacionController;
    } */

    @Override
    public Optional<List <RespuestasDTO>> obtenerRespuestas (String numEmpleado, String nombreCompleto, Boolean invitadoAsiste) {
        try {
            if (checkAuthorization("authorization")) {
                String sql = "{CALL SP_ObtenerRespuestas (?)}";
                // String sql = "SELECT * FROM respuestas WHERE numEmpleado = ?";
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
                // String sql = "INSERT INTO respuestasAsistencia.dbo.respuestas" +
                // "( numEmpleado, nombreCompleto, invitadoAsiste, parejaAsiste, nombrePareja, alergiaAlimentaria, discapacidad, alergiaEsp, discapacidadEsp, comentarios, fechaRegistro,correo)" + 
                // "VALUES(?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?);";
                 //Tiene que estar en el mismo orden el INSERT INTO y el UPDATE                      
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
                // List<RespuestasDTO> result = jdbcSqlServer.query(
                //         consulta,
                //         BeanPropertyRowMapper.newInstance(RespuestasDTO.class),
                //         confirmacionDTO.getNumEmpleado(), confirmacionDTO.getNombreCompleto(), confirmacionDTO.getInvitadoAsiste(), confirmacionDTO.getParejaAsiste(), confirmacionDTO.getNombrePareja(), confirmacionDTO.getAlergiaAlimentaria(), confirmacionDTO.getDiscapacidad(), confirmacionDTO.getAlergiaEsp(), confirmacionDTO.getDiscapacidadEsp(), confirmacionDTO.getComentarios(), confirmacionDTO.getCorreo()
                // );
                // return Optional.ofNullable(result.isEmpty() ? null : result);
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