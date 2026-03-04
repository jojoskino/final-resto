package com.ucao.radbackend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommandeInterne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLigneInterne;

    private int quantite;

    @ManyToOne
    @JoinColumn(name = "id_commande_interne")
    private CommandeInterne commandeInterne;

    @ManyToOne
    @JoinColumn(name = "id_produit")
    private Produit produit;
}
