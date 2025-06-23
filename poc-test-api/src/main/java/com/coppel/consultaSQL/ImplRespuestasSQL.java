package com.coppel.consultaSQL;

public interface ImplRespuestasSQL {
    public Object obtenerRespuestas(String numEmpleado, String nombreCompleto, Boolean invitadoAsiste);
    void ctlRespuestas(String numEmpleado);

}
