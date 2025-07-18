package com.coppel.services;

import com.coppel.dto.ConfirmacionDTO;

public interface RespuestasService {
   public Object consultarLista(String numEmpleado, String nombreCompleto, Boolean invitadoAsiste);
   public Object InsertListaConfirmacion(ConfirmacionDTO Confirma);
}