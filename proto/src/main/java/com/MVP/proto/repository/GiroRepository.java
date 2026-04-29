package com.MVP.proto.repository;

import com.MVP.proto.model.Giro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GiroRepository extends JpaRepository<Giro, Long> {
}