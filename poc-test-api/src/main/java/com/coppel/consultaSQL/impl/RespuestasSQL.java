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

import com.coppel.consultaSQL.ImplRespuestasSQL;
import com.coppel.dto.ConfirmacionDTO;
import com.coppel.dto.RespuestasDTO;

@Component
public class RespuestasSQL implements ImplRespuestasSQL{
    @Autowired
    @Qualifier("sqlServerRes") // Este nombre debe coincidir con el del Bean
    private JdbcTemplate jdbcSqlServer;

    private static Logger log = LoggerFactory.getLogger(RespuestasSQL.class);

    @Override
    public Optional<List <RespuestasDTO>> obtenerRespuestas (String numEmpleado, String nombreCompleto, Boolean invitadoAsiste) {
        try {
            if (checkAuthorization("authorization")) {
                String consulta = "SELECT * FROM respuestas WHERE numEmpleado = ?";
                List<RespuestasDTO> result = jdbcSqlServer.query(
                        consulta,
                        BeanPropertyRowMapper.newInstance(RespuestasDTO.class),
                        numEmpleado
                );
                return Optional.ofNullable(result.isEmpty() ? null : result);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error en consulta: " + e.getMessage());
        }
        return Optional.empty();
    }

    @Override
    public void ctlRespuestas (String numEmpleado) {
        if (checkAuthorization("authorization")) {
            String consulta = "INSERT INTO log_accesos (num_empleado) VALUES (?)";
            jdbcSqlServer.update(consulta, numEmpleado);
        }
    }

    @Override
    public Object InsetListaConfirmacion(ConfirmacionDTO confirmacionDTO){
        try {
            if (checkAuthorization("authorization")) {
                String consulta = "INSERT INTO respuestasAsistencia.dbo.respuestas\n" + //
                                        "(numEmpleado, nombreCompleto, invitadoAsiste, parejaAsiste, nombrePareja, alergiaAlimentaria, discapacidad, alergiaEsp, discapacidadEsp, comentarios, correo)\n" + //
                                        "VALUES(?, ?, ?, ?, ?, ?,?, ?, ?, ?,?);\n" + //
                                        "";
                List<RespuestasDTO> result = jdbcSqlServer.query(
                        consulta,
                        BeanPropertyRowMapper.newInstance(RespuestasDTO.class),
                        confirmacionDTO.getNumEmpleado(), confirmacionDTO.getNombreCompleto(), confirmacionDTO.getInvitadoAsiste(), confirmacionDTO.getParejaAsiste(), confirmacionDTO.getNombrePareja(), confirmacionDTO.getAlergiaAlimentaria(), confirmacionDTO.getDiscapacidad(), confirmacionDTO.getAlergiaEsp(), confirmacionDTO.getDiscapacidadEsp(), confirmacionDTO.getComentarios(), confirmacionDTO.getCorreo()
                );
                return Optional.ofNullable(result.isEmpty() ? null : result);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error en consulta: " + e.getMessage());
        }
        return Optional.empty();
    }

    private static boolean checkAuthorization(String userName) {
        return userName.equals("authorization");
    }

    


}
