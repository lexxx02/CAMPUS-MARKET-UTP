package com.utp.campusmarket.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para kioscos.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KioskDTO {

    private Long id;
    private String name;
    private String location;
    private String floor;
    private Boolean active;
}
