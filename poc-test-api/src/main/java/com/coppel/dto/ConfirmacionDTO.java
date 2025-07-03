package com.coppel.dto;

import java.sql.Date;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ConfirmacionDTO {

    private Date fechaRegistro;
    private String numEmpleado;
    private String nombreCompleto;
    private String correo;
    private Boolean invitadoAsiste;
    private Boolean parejaAsiste;
    private String nombrePareja;
    private Boolean alergiaAlimentaria;
    private String alergiaEsp;
    private Boolean discapacidad;
    private String discapacidadEsp;
    private String comentarios;
}
//Creado para identificar el error en el front. 2 jul