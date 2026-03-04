package com.ucao.radbackend.entities;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(
        name = "rad_client",
        uniqueConstraints = @UniqueConstraint(columnNames = {"nom", "prenom", "telephone"})
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_client")
    private Long idClient;

    @Column(name = "nom", length = 50, nullable = false)
    private String nom;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "adresse")
    private String adresse;

    @Column(name = "telephone")
    private String telephone;

    @Column(name = "id_utilisateur", unique = true)
    private Long idUtilisateur;
}
