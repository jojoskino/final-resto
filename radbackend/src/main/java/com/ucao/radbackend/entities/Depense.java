package com.ucao.radbackend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Depense {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDepense;
    
    @Column(nullable = false, length = 200)
    private String libelle;
    
    @Column(nullable = false)
    private Double montant;
    
    @Column(length = 500)
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeDepense typeDepense;
    
    @Column(nullable = false)
    private LocalDateTime dateDepense;
    
    @ManyToOne
    @JoinColumn(name = "id_fournisseur")
    private Fournisseur fournisseur;
    
    public enum TypeDepense {
        ACHAT_PRODUITS,
        SALAIRES,
        LOYER,
        UTILITAIRES,
        MAINTENANCE,
        MARKETING,
        AUTRE
    }
}





