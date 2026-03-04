package com.ucao.radbackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CommandeRequest {
    private Long clientId;
    private Long utilisateurId; // Permet de passer soit clientId soit utilisateurId
    private List<LigneCommandeRequest> lignesCommande;
}


