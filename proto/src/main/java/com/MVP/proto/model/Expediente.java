package com.MVP.proto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "expedientes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Expediente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String folioExpediente; // Folio visible: EXP-2026-{id}

    private String estatusGeneral; // Activo, En Proceso, Cerrado

    private String fechaCreacion;

    // Campos desnormalizados para facilitar consultas y dropdowns
    private String dependencia; // Copiado del estudio de mercado al crear

    private String descripcionBreve; // Resumen rápido del expediente
}
