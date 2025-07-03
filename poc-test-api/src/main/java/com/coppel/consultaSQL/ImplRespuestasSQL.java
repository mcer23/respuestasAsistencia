package com.coppel.consultaSQL;

import com.coppel.dto.ConfirmacionDTO;

public interface ImplRespuestasSQL {
    public Object obtenerRespuestas(String numEmpleado, String nombreCompleto, Boolean invitadoAsiste);
    public Object InsetListaConfirmacion(ConfirmacionDTO Confirma);
    void ctlRespuestas(String numEmpleado);

}
