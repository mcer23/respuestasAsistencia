/*package com.coppel.mappers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.coppel.dto.RespuestasDTO;
import com.coppel.models.RespuestasAsistencia;

@Component
public class RespuestasMapper {
    public RespuestasDTO toDo(RespuestasAsistencia entity){
        if (entity == null) {
            return null;
        }

        return new RespuestasDTO(
            entity.getId(),
            entity.getNumEmpleado(),
            entity.getNombreCompleto(),
            entity.getInvitadoAsiste(),
            entity.getParejaAsiste(),
            entity.getAlergiaAlimentaria(),
            entity.getDiscapacidad()
        );
         
    }
    public static RespuestasAsistencia toEntity(RespuestasDTO dto) {
        if (dto == null) {
            return null;
        }

        RespuestasAsistencia entity = new RespuestasAsistencia();
        entity.setId(dto.getId());
        entity.setNumEmpleado(dto.getNumEmpleado());
        entity.setNombreCompleto(dto.getNombreCompleto());
        entity.setInviadoAsiste(dto.getInvitadoAsiste());
        entity.setparejaAsiste(dto.getParejaAsiste());
        entity.setAlergiaAlimentaria(dto.getAlergiaAlimentaria());
        entity.setDiscapacidad(dto.getDiscapacidad());

        return entity;
    }
    public List<RespuestasDTO> toDtoList(List<RespuestasAsistencia> entities) {
        return entities.stream()
            .map(this::toDo)
            .collect(Collectors.toList());
    }
    
    public List <RespuestasAsistencia> toEntityList(List<RespuestasDTO> dtos) {
        return dtos.stream()
            .map(this::toEntity)
            .collect(Collectors.toList());
    }

    
    
}*/
