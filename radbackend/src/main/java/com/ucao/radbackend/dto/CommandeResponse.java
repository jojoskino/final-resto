package com.ucao.radbackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class CommandeResponse {
    private Long idCommande;
    private String dateCommande;
    private String statut;
    private ClientDTO client;
    private List<LigneCommandeDTO> lignesCommande;

    @Data
    public static class ClientDTO {
        private Long idClient;
        private String nom;
        private String prenom;
        private String telephone;
    }

    @Data
    public static class LigneCommandeDTO {
        private Long idLigne;
        private int quantite;
        private double prixUnitaire;
        private PlatDTO plat;
    }

    @Data
    public static class PlatDTO {
        private Long idPlat;
        private String nom;
        private double prix;
    }
}





