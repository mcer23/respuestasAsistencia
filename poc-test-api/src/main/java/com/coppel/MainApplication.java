package com.coppel;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.coppel.config.AppConfig;

@SpringBootApplication
public class MainApplication {

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }
    @Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:4200") // o el URL de tu frontend
            .allowedMethods("*");
    }
}


    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Autowired
            private AppConfig config;

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String regex = "\\s*,\\s*";
                
                registry.addMapping("/**")
                        .allowedOrigins(config.getAllowedOrigins().split(regex))
                        .allowedMethods(config.getAllowedMethods().split(regex))
                        .allowedHeaders(config.getAllowedHeaders().split(regex))
                        .exposedHeaders(config.getExposedHeaders().split(regex));
            }
        };
    }
}
