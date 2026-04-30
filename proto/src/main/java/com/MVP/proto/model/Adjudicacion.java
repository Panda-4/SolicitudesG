package com.MVP.proto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "adjudicaciones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Adjudicacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // === RELACIÓN CON EXPEDIENTE MAESTRO ===
    @ManyToOne
    @JoinColumn(name = "expediente_id")
    private Expediente expediente;

    @Column(unique = true)
    private String folioInterno; // Folio de seguimiento (manual)

    private String nombreRazonSocial;
    private String rfc;
    private String montoTotalConIva; // $MXN
    private String numeroContrato;
    private String vigenciaInicio;
    private String vigenciaFin;
    private String montoMaximo;
    private String estatusAdjudicacion;
    private String instrumentoNotarial;
    private String terminoVigencia; // Fecha
    private String publicacionTestigoUrl; // URL del testimonio
    private String remanenteSuficiencia; // $MXN
    private String nombreResponsable;

    @Column(columnDefinition = "TEXT")
    private String comentarios;

    private String estatus; // Adjudicado, Formalizado, En Revisión, Cancelado
    private Boolean reprogramacion; // Toggle
    private String fechaRegistro;
}
