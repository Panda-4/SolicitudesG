package com.MVP.proto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate; // O String, dependiendo de cómo lo manejes

@Entity
@Table(name = "estudios_mercado") // Asegúrate que el nombre de la tabla coincida con tu BD
@Data // <--- ESTO ES CLAVE: Genera getters, setters, toString, etc.
@NoArgsConstructor
@AllArgsConstructor
public class EstudioMercado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // <--- ESTE CAMPO DEBE EXISTIR

    // === RELACIÓN CON EXPEDIENTE MAESTRO ===
    @ManyToOne
    @JoinColumn(name = "expediente_id")
    private Expediente expediente;

    private String folio; // <--- ESTE CAMPO DEBE EXISTIR
    
    private String fechaIngreso; // <--- ESTE CAMPO DEBE EXISTIR PARA EL REPOSITORIO
    
    private String dependencia;
    private String centroCosto;
    private String origenRecurso;
    private String capitulo;
    private String partida;
    private String giro;
    private String valorEstudio; // O Double/BigDecimal si prefieres números
    private String estatus;
    private String montoSabys;
    private String descripcionBien;
    private Boolean contratacionPlurianual;

    // Si NO usas Lombok (@Data), tendrías que escribir manualmente:
    // public Long getId() { return id; }
    // public void setId(Long id) { this.id = id; }
    // public String getFolio() { return folio; }
    // public void setFolio(String folio) { this.folio = folio; }
    // ... etc para todos los campos
}