package com.MVP.proto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // 1. Permitir CUALQUIER origen (ideal para desarrollo local)
        config.addAllowedOriginPattern("*"); 
        
        // 2. Permitir CUALQUIER encabezado
        config.addAllowedHeader("*");
        
        // 3. Permitir CUALQUIER método (GET, POST, PUT, DELETE, OPTIONS, etc.)
        config.addAllowedMethod("*");
        
        // 4. Permitir credenciales (cookies, auth headers)
        config.setAllowCredentials(true);
        
        // 5. Aplicar a todas las rutas
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}