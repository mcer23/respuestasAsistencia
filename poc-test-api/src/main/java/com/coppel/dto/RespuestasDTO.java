package com.coppel.dto;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@Data   public class RespuestasDTO {

    private Long id;
    private String numEmpleado;
    private String nombreCompleto;
    private Boolean invitadoAsiste;
    private Boolean parejaAsiste;
    private Boolean alergiaAlimentaria;
    private Boolean discapacidad;


    /**
     * @param id
     * @param numEmpleado
     * @param nombreCompleto
     * @param invitadoAsiste
     * @param parejaAsiste
     * @param alergiaAlimentaria
     * @param discapacidad
     */
    public RespuestasDTO(Long id, String numEmpleado, String nombreCompleto, Boolean invitadoAsiste, Boolean parejaAsiste, Boolean alergiaAlimentaria, Boolean discapacidad) {
        this.id = id;
        this.numEmpleado = numEmpleado;
        this.nombreCompleto = nombreCompleto;
        this.invitadoAsiste = invitadoAsiste;
        this.parejaAsiste = parejaAsiste;
        this.alergiaAlimentaria = alergiaAlimentaria;
        this.discapacidad = discapacidad;
    }

    public List <RespuestasDTO> RespuestasList;
}
