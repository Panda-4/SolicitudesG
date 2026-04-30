package com.MVP.proto.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                response.sendError(jakarta.servlet.http.HttpServletResponse.SC_UNAUTHORIZED, "Token expirado o inválido");
            }))
            .authorizeHttpRequests(auth -> auth
                // === RUTAS PÚBLICAS (sin token) ===
                .requestMatchers("/api/auth/**").permitAll()

                // === ESTUDIOS DE MERCADO ===
                .requestMatchers(HttpMethod.POST, "/api/estudios").hasAnyRole("ADMINISTRADOR", "ESTUDIO_MERCADO")
                .requestMatchers(HttpMethod.PUT, "/api/estudios/**").hasAnyRole("ADMINISTRADOR", "ESTUDIO_MERCADO")
                .requestMatchers(HttpMethod.DELETE, "/api/estudios/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/estudios/**").hasAnyRole("ADMINISTRADOR", "ESTUDIO_MERCADO", "CONSULTOR")

                // === AFECTACIÓN PRESUPUESTAL ===
                .requestMatchers(HttpMethod.POST, "/api/afectaciones").hasAnyRole("ADMINISTRADOR", "AFECTACION")
                .requestMatchers(HttpMethod.PUT, "/api/afectaciones/**").hasAnyRole("ADMINISTRADOR", "AFECTACION")
                .requestMatchers(HttpMethod.DELETE, "/api/afectaciones/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/afectaciones", "/api/afectaciones/**").hasAnyRole("ADMINISTRADOR", "AFECTACION", "CONSULTOR", "ADQUISICIONES", "ADJUDICACION")

                // === ADQUISICIONES / PROCEDIMIENTOS ===
                .requestMatchers(HttpMethod.POST, "/api/procedimientos").hasAnyRole("ADMINISTRADOR", "ADQUISICIONES")
                .requestMatchers(HttpMethod.PUT, "/api/procedimientos/**").hasAnyRole("ADMINISTRADOR", "ADQUISICIONES")
                .requestMatchers(HttpMethod.DELETE, "/api/procedimientos/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/procedimientos", "/api/procedimientos/**").hasAnyRole("ADMINISTRADOR", "ADQUISICIONES", "CONSULTOR", "ADJUDICACION")

                // === ADJUDICACIÓN ===
                .requestMatchers(HttpMethod.POST, "/api/adjudicaciones").hasAnyRole("ADMINISTRADOR", "ADJUDICACION")
                .requestMatchers(HttpMethod.PUT, "/api/adjudicaciones/**").hasAnyRole("ADMINISTRADOR", "ADJUDICACION")
                .requestMatchers(HttpMethod.DELETE, "/api/adjudicaciones/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/adjudicaciones", "/api/adjudicaciones/**").hasAnyRole("ADMINISTRADOR", "ADJUDICACION", "CONSULTOR")

                // === EXPEDIENTES Y TRAZABILIDAD ===
                .requestMatchers(HttpMethod.PUT, "/api/expedientes/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/expedientes/**").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.GET, "/api/expedientes", "/api/expedientes/**").hasAnyRole("ADMINISTRADOR", "CONSULTOR",
                        "ESTUDIO_MERCADO", "AFECTACION", "ADQUISICIONES", "ADJUDICACION")

                // === CATÁLOGOS (lectura para todos los autenticados) ===
                .requestMatchers(HttpMethod.GET, "/api/catalogos/**").authenticated()

                // === GESTIÓN DE USUARIOS Y AUDITORÍA (solo ADMIN) ===
                .requestMatchers("/api/usuarios/**").hasRole("ADMINISTRADOR")
                .requestMatchers("/api/auditoria/**").hasRole("ADMINISTRADOR")

                // Todo lo demás requiere autenticación
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
