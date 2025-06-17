package com.coppel.consultaSQL;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.coppel.consultaSQL.impl.*;
import com.coppel.dto.RespuestasDTO;


public class RespuestasSQL implements ImplRespuestasSQL{


    @Autowired
    @Qualifier("sqlServerConvencion")
    private JdbcTemplate jbcSqlServerCon;
    
    @Autowired
    @Qualifier("sqlServerPer")
    private JdbcTemplate jdbcSqlServerPer;

    private static Logger log= LoggerFactory.getLogger(QuerySqlServer.class);

    @Override
    public Optional <List<RespuestasDTO>> 
    consultarLista (String numEmpleado, String nombreCompleto, Boolean invitadoAsiste){
        try{
            if (checkAuthorization ("authorization")){
                String consulta = "PROC_VERIFICACION_ASISTENTES_CONVENCION ?,?,?,?";
                List <RespuestasDTO> result = this.jbcSqlServerCon.query (consulta, BeanPropertyRowMapper.newInstance(RespuestasDTO.class), numEmpleado, nombreCompleto, invitadoAsiste);

                return Optional.ofNullable(result.isEmpty()?  null : result);

            }
        } catch (Exception e){
            throw new MyException(
                -9,
                String.format(e.getMessage()
                )
            );
        }
    }
    @Override
    public void ctlRespuestas (String numEmpleado){
        if (checkAuthorization("authorization")){
            String consulta = "PROC_INSERT_LOG_CONVENCION ?,?";
            this.jbcSqlServerCon.update(consulta);
        }
    }
    private static boolean checkAuthorization(String userName){
        return userName.equals("authorization");
    }
    


    
}
