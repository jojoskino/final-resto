package com.ucao.radbackend.dto;

import lombok.Data;

@Data
public class LigneCommandeRequest {
    private Long platId;
    private int quantite;
    private double prixUnitaire;
}


