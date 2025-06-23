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
import com.coppel.consultaSQL.impl.*;
import com.coppel.dto.RespuestasDTO;

@Component
public class RespuestasSQL implements ImplRespuestasSQL{
    @Autowired
    @Qualifier("jdbcSqlServer") // Este nombre debe coincidir con el del Bean
    private JdbcTemplate jdbcSqlServer;

    private static Logger log = LoggerFactory.getLogger(RespuestasSQL.class);

    @Override
    public Optional<List <RespuestasDTO>> obtenerRespuestas (String numEmpleado, String nombreCompleto, Boolean invitadoAsiste) {
        try {
            if (checkAuthorization("authorization")) {
                String consulta = "SELECT * FROM asistentes WHERE num_empleado = ? AND nombre_completo = ? AND invitado_asiste = ?";
                List<RespuestasDTO> result = jdbcSqlServer.query(
                        consulta,
                        BeanPropertyRowMapper.newInstance(RespuestasDTO.class),
                        numEmpleado,
                        nombreCompleto,
                        invitadoAsiste
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

    private static boolean checkAuthorization(String userName) {
        return userName.equals("authorization");
    }

    @Override
    public Object obtenerRespuestas(String numEmpleado, String nombreCompleto, Boolean invitadoAsiste) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'ImplRespuestasSQL'");
    }


}
