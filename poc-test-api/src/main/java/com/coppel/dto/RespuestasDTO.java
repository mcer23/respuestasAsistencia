package com.coppel.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@Data   public class RespuestasDTO {

    private String numEmpleado;
    private String nombreCompleto;
    private Boolean invitadoAsiste;
    private Boolean parejaAsiste;
    private Boolean alergiaAlimentaria;
    private Boolean discapacidad;
    private String comentarios;
    private String alergiaEsp;
    private String discapacidadEsp;
    private LocalDate fechaRegistro;


    /**
     * @param numEmpleado
     * @param nombreCompleto
     * @param invitadoAsiste
     * @param parejaAsiste
     * @param alergiaAlimentaria
     * @param discapacidad
     * @param comentarios
     * @param alergiaEsp
     * @param discapacidadEsp
     * @param fechaRegistro
     */
    public RespuestasDTO(String numEmpleado, String nombreCompleto, Boolean invitadoAsiste, Boolean parejaAsiste, Boolean alergiaAlimentaria, Boolean discapacidad, String comentarios, String alergiaEsp, String discapacidadEsp) {
        this.numEmpleado = numEmpleado;
        this.nombreCompleto = nombreCompleto;
        this.invitadoAsiste = invitadoAsiste;
        this.parejaAsiste = parejaAsiste;
        this.alergiaAlimentaria = alergiaAlimentaria;
        this.discapacidad = discapacidad;
        this.comentarios = comentarios;
        this.alergiaEsp = alergiaEsp;
        this. discapacidadEsp = discapacidadEsp;
        this.fechaRegistro = fechaRegistro;
    }

    public List <RespuestasDTO> RespuestasList;
}
