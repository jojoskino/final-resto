package com.ucao.radbackend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Plat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPlat;

    private String nom;

    private String description;

    private double prix;

    @Column(length = 500)
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private CategoriePlat categorie;
}
