package com.coppel.dto;

import com.fasterxml.jackson.core.ErrorReportConfiguration;

//28 jul: debe de funcionar con los ajustes en ConfirmacionController:  public ResponseEntity<Object> guardarRespuestasv2(
public class ErrorResponseDTO {
    private String message;
    private Integer errorCode;
    private String details;

    public ErrorResponseDTO(){}

    public ErrorResponseDTO(String message){
        this.message = message;
    }
    public ErrorResponseDTO(String message, Integer errorCode, String detaisl){
        this.message=message;
        this.errorCode=errorCode;
        this.details=details;
    }
    public String getMessege(){
        return message;
    }
    public Integer getErrorCode(){
    return errorCode;
    }
    public String getDetails(){
        return details;
    }
}
