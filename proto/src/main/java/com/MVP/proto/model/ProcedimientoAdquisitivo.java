package com.MVP.proto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "procedimientos_adquisitivos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcedimientoAdquisitivo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // === RELACIÓN CON EXPEDIENTE MAESTRO ===
    @ManyToOne
    @JoinColumn(name = "expediente_id")
    private Expediente expediente;

    @Column(unique = true)
    private String noProcedimiento; // Número manual del procedimiento

    private String modalidadProcedimiento; // Licitación Pública, Invitación, Adjudicación Directa
    private String convocatoriaUrl; // URL de convocatoria/invitación
    private String medioPublicacion; // CompraNet, DOF, Gaceta, etc.

    // === CRONOGRAMA DEL PROCEDIMIENTO (7 eventos fecha+hora) ===
    private String fechaJuntaAclaracion;
    private String horaJuntaAclaracion;
    private String fechaPresentacionApertura;
    private String horaPresentacionApertura;
    private String fechaSesionComite;
    private String horaSesionComite;
    private String fechaContraOferta;
    private String horaContraOferta;
    private String fechaDictaminacion;
    private String horaDictaminacion;
    private String fechaSesionSubcomite;
    private String horaSesionSubcomite;
    private String fechaFallo;
    private String horaFallo;

    private String estatus; // En Proceso, Adjudicado, Desierto
    private String fechaRegistro;
}
