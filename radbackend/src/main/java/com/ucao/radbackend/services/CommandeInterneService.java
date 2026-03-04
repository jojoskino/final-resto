package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.CommandeInterne;
import java.util.List;

public interface CommandeInterneService {

    List<CommandeInterne> getAllCommandesInternes();

    CommandeInterne getCommandeInterneById(Long id);

    CommandeInterne createCommandeInterne(CommandeInterne commandeInterne);

    CommandeInterne updateCommandeInterne(Long id, CommandeInterne commandeInterne);

    void deleteCommandeInterne(Long id);
}
