package com.coppel.dto;

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
    private String comentarios;


    /**
     * @param id
     * @param numEmpleado
     * @param nombreCompleto
     * @param invitadoAsiste
     * @param parejaAsiste
     * @param alergiaAlimentaria
     * @param discapacidad
     * @param comentarios
     */
    public RespuestasDTO(Long id, String numEmpleado, String nombreCompleto, Boolean invitadoAsiste, Boolean parejaAsiste, Boolean alergiaAlimentaria, Boolean discapacidad) {
        this.id = id;
        this.numEmpleado = numEmpleado;
        this.nombreCompleto = nombreCompleto;
        this.invitadoAsiste = invitadoAsiste;
        this.parejaAsiste = parejaAsiste;
        this.alergiaAlimentaria = alergiaAlimentaria;
        this.discapacidad = discapacidad;
        this.comentarios = comentarios;
    }

    public List <RespuestasDTO> RespuestasList;
}
