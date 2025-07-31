package com.coppel.config;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//28 jul: intento de Global CORS Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**") // Apply CORS to all API endpoints
                .allowedOrigins("http://localhost:4200") // Specify your Angular app's origin
                .allowedMethods("GET","POST","DELETE","OPTIONS") // Allow common HTTP methods
                .allowedHeaders("*")// Allow all headers (e.g., Content-Type, Authorization)
                .allowCredentials(true) // If your frontend sends cookies or auth headers
                .maxAge(3600);// How long the preflight response can be cached
    }
    
}
