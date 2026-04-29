package com.MVP.proto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "catalogo_giros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Giro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String clave; // Ej: 2111
    private String nombre; // Descripción
}