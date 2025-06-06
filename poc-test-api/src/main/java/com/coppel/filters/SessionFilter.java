package com.coppel.filters;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import com.coppel.config.AppConfig;
import com.coppel.dto.ApiResponseDTO;
import com.coppel.util.AppMessages;
import com.coppel.util.Meta;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
* SessionFilter
*/
@Component
@Order(value = 1)
public class SessionFilter implements Filter {
    
    @Autowired
    private AppConfig config;

    @Override
    public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain) 
            throws IOException, ServletException {

        final HttpServletRequest req = (HttpServletRequest) request;
        final HttpServletResponse res = (HttpServletResponse) response;
        
        res.reset();
        res.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, config.getAllowedOrigins() );
        res.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, config.getAllowedMethods() );
        res.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, config.getAllowedHeaders() );
        res.setHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE);
        res.setHeader("X-API-Version", config.getBuildProperties().getVersion());
        res.setCharacterEncoding("UTF-8");
        
        final ApiResponseDTO apiResponseDTO = new ApiResponseDTO();
        final ObjectMapper objectMapper = new ObjectMapper();
        
        if (config.isIgnoreSession()) {
            chain.doFilter(request, response);
            return;
        }
        
        if (req.getHeader(HttpHeaders.AUTHORIZATION) == null) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            apiResponseDTO.setMeta(new Meta(null, AppMessages.CLIENT_ERROR, 401, AppMessages.UNAUTHORISED_MESSAGE));
            res.getWriter().write(objectMapper.writeValueAsString(apiResponseDTO));
        } else {
            final RestTemplate client = new RestTemplate();
            final HttpHeaders authHeaders = new HttpHeaders();
            authHeaders.add(HttpHeaders.AUTHORIZATION, req.getHeader(HttpHeaders.AUTHORIZATION));
            final HttpEntity<String> httpEntity = new HttpEntity<>(authHeaders);
            try {
                final ResponseEntity<String> authResponse = client.exchange(config.getAuthUri(), HttpMethod.POST, httpEntity, String.class);
                if (authResponse.getStatusCode() == HttpStatus.OK) {
                    chain.doFilter(request, response);
                }
            } catch (RestClientException ex) {
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                apiResponseDTO.setMeta(new Meta(null, AppMessages.CLIENT_ERROR, 401, AppMessages.UNAUTHORISED_MESSAGE));
                res.getWriter().write(objectMapper.writeValueAsString(apiResponseDTO));
            }
        }
    }
}
