package com.ucao.radbackend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity(name = "command_interne")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommandeInterne {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCommandeInterne;

    private String date;
    private String etat;

    @ManyToOne
    @JoinColumn(name = "id_fournisseur")
    private Fournisseur fournisseur;
}
