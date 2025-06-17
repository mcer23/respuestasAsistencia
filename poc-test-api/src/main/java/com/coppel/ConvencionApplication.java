package com.coppel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
@PropertySource("classpath:application.yaml")
public class ConvencionApplication {

	public static void main(String[] args) {
		//loadEnvVariables();
		SpringApplication.run(ConvencionApplication.class, args);
	}

	@Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @SuppressWarnings("null")
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:4200", "https://dev-appadmoncloud.coppel.io",
                    "https://php-appadmon.coppel.io", "https://dev-appersonalcloud.coppel.io")  // Asegúrate de que esta IP se corresponda con la que usas
                    .allowedMethods("GET", "POST", "OPTIONS")  // Añade los métodos que necesites
                    .allowedHeaders("Authorization", "Content-Type", "x-coppel-date-request", "x-coppel-latitude", "x-coppel-longitude", "x-coppel-transactionid", "X-Servidor-Dominio", "X-Usuario-IP")  // Encabezados permitidos
                    .allowCredentials(true);  // Permitir credenciales (cookies)
            }
        };
    }

	// public static void loadEnvVariables(){
    //     try {
    //     	System.setProperty("IPconvencion", "10.201.82.2");
	// 		System.setProperty("DBconvencion", "Convencion");
	// 		System.setProperty("USERconvencion", "sysconvenciones");
	// 		System.setProperty("PASSconvencion", "yujaDoqucA$0gLT11");
			
    //     } catch (Exception e) {
    //     }
    // }

}
