package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.Client;
import com.ucao.radbackend.repositories.ClientRepositories;
import com.ucao.radbackend.services.ClientService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClientServiceImpl implements ClientService {

    private final ClientRepositories clientRepositories;

    public ClientServiceImpl(ClientRepositories clientRepositories) {
        this.clientRepositories = clientRepositories;
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepositories.findAll();
    }

    @Override
    public Client getClientById(Long id) {
        return clientRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable avec ID : " + id));
    }

    @Override
    public Client createClient(Client client) {
        return clientRepositories.save(client);
    }

    @Override
    public Client updateClient(Long id, Client newData) {

        Client existing = clientRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable avec ID : " + id));

        if (newData.getNom() != null) {
            existing.setNom(newData.getNom());
        }

        if (newData.getPrenom() != null) {
            existing.setPrenom(newData.getPrenom());
        }

        if (newData.getAdresse() != null) {
            existing.setAdresse(newData.getAdresse());
        }

        if (newData.getTelephone() != null) {
            existing.setTelephone(newData.getTelephone());
        }

        return clientRepositories.save(existing);
    }

    @Override
    public void deleteClient(Long id) {
        if (!clientRepositories.existsById(id)) {
            throw new RuntimeException("Client introuvable avec ID : " + id);
        }

        clientRepositories.deleteById(id);
    }
}
