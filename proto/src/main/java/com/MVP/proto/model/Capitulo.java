package com.MVP.proto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "catalogo_capitulos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Capitulo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String clave; // Ej: 1000
    private String nombre; // Ej: Servicios Personales
}