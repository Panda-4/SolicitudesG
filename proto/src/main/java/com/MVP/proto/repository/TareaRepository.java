package com.MVP.proto.repository; // ⚠️ IMPORTANTE

import com.MVP.proto.model.Tarea;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TareaRepository extends JpaRepository<Tarea, Long> {
    // Métodos personalizados si los necesitas
}