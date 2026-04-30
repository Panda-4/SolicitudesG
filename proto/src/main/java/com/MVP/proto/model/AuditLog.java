package com.MVP.proto.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "audit_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accion;           // CREATE, UPDATE, DELETE
    private String entidad;          // ESTUDIO, AFECTACION, PROCEDIMIENTO, ADJUDICACION, EXPEDIENTE
    private Long entidadId;          // ID del registro afectado
    private String folioReferencia;  // Folio visible del registro

    private String usuario;          // Username del que ejecutó
    private String rolUsuario;       // Rol al momento de la acción

    @Column(columnDefinition = "TEXT")
    private String valorAnterior;    // JSON snapshot antes (null en CREATE)

    @Column(columnDefinition = "TEXT")
    private String valorNuevo;       // JSON snapshot después (null en DELETE)

    private String descripcion;      // Descripción legible de la acción
    private String fechaHora;        // Timestamp ISO
}
