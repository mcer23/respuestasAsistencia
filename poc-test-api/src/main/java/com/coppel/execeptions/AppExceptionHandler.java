package com.coppel.execeptions;

import java.time.LocalDateTime;

import com.coppel.dto.ApiResponseDTO;
import com.coppel.util.AppMessages;
import com.coppel.util.Meta;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;


/**
 * Clase para manejo de excepciones no controladas.
 */
@ControllerAdvice
public class AppExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(value = {ResponseStatusException.class})
    public ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex) {
        Meta meta = new Meta();
        meta.setDevMessage(null);
        meta.setStatus(AppMessages.CLIENT_ERROR);
        meta.setStatusCode(ex.getStatusCode().value());
        meta.setMessage(ex.getReason());
        meta.setTimestamp(LocalDateTime.now().toString());
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        ApiResponseDTO apiResponse = new ApiResponseDTO(meta, null);
        return new ResponseEntity<>(apiResponse, httpHeaders, ex.getStatusCode());
    }
    
    /** 
     * Cualquier excepción que no sea atendida será tratada en en este método.
     * @param runtimeException
     * @param webRequest
     * @return ResponseEntity<Object>
     */
    @ExceptionHandler(value = {Exception.class})
    protected ResponseEntity<Object> handleException(RuntimeException runtimeException, WebRequest webRequest) {
        Meta meta = new Meta();
        meta.setStatus(AppMessages.ERROR);
        meta.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
        meta.setDevMessage(runtimeException.getMessage() == null ? runtimeException.getClass().toString() : runtimeException.getMessage());
        meta.setTimestamp(LocalDateTime.now().toString());
        meta.setTransactionID(null);
        ApiResponseDTO apiResponse = new ApiResponseDTO(meta, null);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        return handleExceptionInternal(
            runtimeException,
            apiResponse,
            httpHeaders,
            HttpStatus.INTERNAL_SERVER_ERROR,
            webRequest
        );
    }
    
}
