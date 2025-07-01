package com.coppel.models;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
@Data
@Entity
public class RespuestasAsistencia {
     @Id
    private Date fechaRegistro;
    private String numEmpleado;
    private String nombreCompleto;
    private Boolean invitadoAsiste;
    private Boolean parejaAsiste;
    private String nombrePareja;
    private Boolean alergiaAlimentaria;
    private String alergiaEsp;
    private Boolean discapacidad;
    private String discapacidadEsp;
    private String comentarios;
}
