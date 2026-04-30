package com.MVP.proto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "afectaciones_presupuestales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AfectacionPresupuestal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // === RELACIÓN CON EXPEDIENTE MAESTRO ===
    @ManyToOne
    @JoinColumn(name = "expediente_id")
    private Expediente expediente;

    // Referencia al estudio de origen (para trazabilidad directa)
    private Long estudioId;

    @Column(unique = true)
    private String folioCa; // Folio visible: CA-2026-{id}

    private String fechaLiberacionEm; // Fecha de liberación del Estudio de Mercado
    private String testigoSocial;
    private String tipoGasto; // Gasto Corriente, Gasto de Inversión, Otros
    private String fuenteFinanciamiento; // Estatal, Federal, Mixto, Otros
    private String montoAfectado;
    private String partidaPresupuestal;
    private String estatusSuficiencia;
    private String fechaSuficiencia;
    private String observaciones; // Monto $MXN
    private String oficioSuficiencia; // Número de oficio
    private String claveVerificacion; // Clave alfanumérica
    private String descripcionClave; // Descripción amplia (textarea)
    private String unidadMedida; // Pieza, Servicio, Lote, etc.
    private Boolean contratoAbierto; // Toggle
    private Boolean consolidado; // Toggle
    private String estatus; // Pendiente, En Revisión, Aprobado, Rechazado
    private String fechaRegistro; // Fecha de creación del registro
    
    // Campo para Pertenencia (Owner)
    private String creadorUsername;
}
