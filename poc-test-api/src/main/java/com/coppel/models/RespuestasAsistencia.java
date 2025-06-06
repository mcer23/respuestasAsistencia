package com.coppel.models;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class RespuestasAsistencia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date fechaRegistro;
    private String numEmpleado;
    private String nombreCompleto;
    private String correo;
    private Boolean invitadoAsiste;
    private Boolean parejaAsiste;
    private String nombrePareja;
    private Boolean alergiaAlimentaria;
    private String especificacionAlergia;
    private Boolean discapacidad;
    private String descripcionDiscapacidad;
    private String comentarios;

    public RespuestasAsistencia(){}

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id=id;
    }
    public Date getFechaRegistro(){
        return fechaRegistro;
    }
    public void setFechaRegistro(Date fechaRegistro){
        this.fechaRegistro=fechaRegistro;
    }

    public String getNumEmpleado(){
        return numEmpleado;
    }
    public void setNumEmpeado(String numEmleado){
        this.numEmpleado=numEmleado;
    }

    public String getNombreCompleto(){
        return nombreCompleto;
    }
    public void setNombreCompleto(String nombreCompleto){
        this.nombreCompleto=nombreCompleto;
    }
    public String getCorreo(){
        return correo;
    }
    public void setCorreo(String correo){
        this.correo=correo;
    }
    public Boolean getInvitadoAsiste(){
        return invitadoAsiste;
    }
    public void setInviadoAsiste(Boolean invitadoAsiste){
        this.invitadoAsiste=invitadoAsiste;
    }
    public Boolean getParejaoAsiste(){
        return parejaAsiste;
    }
    public void setParejaoAsiste(Boolean parejaAsiste){
        this.parejaAsiste=parejaAsiste;
    }
    public String getNombrePareja(){
        return nombrePareja;
    }
    public void setNombrePareja(String nombrePareja){
        this.nombrePareja=nombrePareja;
    }
    public Boolean getAlergiaAlimentaria(){
        return alergiaAlimentaria;
    }
    public void setAlergiaAlimentaria(Boolean alergiaAlimentaria){
        this.alergiaAlimentaria=alergiaAlimentaria;
    }
    public String getEspecificacionAlergia(){
        return especificacionAlergia;
    }
    public void setEspecificacionAlergia(String especificacionAlergia){
        this.especificacionAlergia=especificacionAlergia;
    }
    public Boolean getDiscapacidad(){
        return discapacidad;
    }
    public void setDiscapacidad(Boolean dispacidad){
        this.discapacidad=dispacidad;
    }
    public String getDescripcionDiscapacidad(){
        return descripcionDiscapacidad;
    }
    public void setDescripcionDiscapacidad(String descripcionDiscapacidad){
        this.descripcionDiscapacidad=descripcionDiscapacidad;
    }
    public String getComentarios(){
        return comentarios;
    }
    public void setComentarios(String comentarios){
        this.comentarios=comentarios;
    }

    public Boolean getParejaAsiste() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getParejaAsiste'");
    }

    public void setNumEmpleado(String numEmpleado2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setNumEmpleado'");
    }

    public void setparejaAsiste(Boolean parejaAsiste2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setparejaAsiste'");
    }
    
}
