package com.ucao.radbackend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Paiement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPaiement;

    private String datePaiement;
    private double montant;

    @Column(length = 30)
    private String methode; // CB, cash, etc.

    @OneToOne
    @JoinColumn(name = "id_commande")
    private Commande commande;
}
