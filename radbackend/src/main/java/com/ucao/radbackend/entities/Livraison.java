package com.ucao.radbackend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Livraison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLivraison;

    private String dateLivraison;

    @Column(length = 150)
    private String adresseDestination;

    @OneToOne
    @JoinColumn(name = "id_commande")
    private Commande commande;
}
