package com.ucao.radbackend.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Commande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCommande;

    @Column(nullable = false)
    private String dateCommande;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut")
    private StatutCommande statut = StatutCommande.EN_ATTENTE;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_client")
    private Client client;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<LigneCommande> lignesCommande = new ArrayList<>();

    public enum StatutCommande {
        EN_ATTENTE,
        EN_PREPARATION,
        PRETE,
        EN_LIVRAISON,
        LIVREE,
        ANNULEE
    }
}
