
package com.coppel.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;

import com.coppel.consultaSQL.ImplRespuestasSQL;
import com.coppel.dto.ConfirmacionDTO;
import com.coppel.services.RespuestasService;


@Service
@PropertySource("classpath:application.yaml")
public class ImplRespuestas implements RespuestasService{
    @Autowired
    private ImplRespuestasSQL implRespuestasSQL;
    
    @Override
    public Object consultarLista(String numEmpleado, String nombreCompleto, Boolean invitadoAsiste){
      return this.implRespuestasSQL.obtenerRespuestas(numEmpleado,nombreCompleto,invitadoAsiste);
      
    }

    @Override
    public Object InsertListaConfirmacion(ConfirmacionDTO confirmacion){
      return this.implRespuestasSQL.InsertListaConfirmacion(confirmacion);
    }

    
};