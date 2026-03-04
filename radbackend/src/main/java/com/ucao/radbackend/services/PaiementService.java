package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.Paiement;
import java.util.List;

public interface PaiementService {

    List<Paiement> getAllPaiements();

    Paiement getPaiementById(Long id);

    Paiement createPaiement(Paiement paiement);

    Paiement updatePaiement(Long id, Paiement paiement);

    void deletePaiement(Long id);
}
