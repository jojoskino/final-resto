package com.ucao.radbackend.services.impl;

import com.ucao.radbackend.entities.Menu;
import com.ucao.radbackend.entities.Plat;
import com.ucao.radbackend.repositories.MenuRepositories;
import com.ucao.radbackend.repositories.PlatRepositories;
import com.ucao.radbackend.services.MenuService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuServiceImpl implements MenuService {

    private final MenuRepositories menuRepositories;
    private final PlatRepositories platRepositories;

    public MenuServiceImpl(MenuRepositories menuRepositories, PlatRepositories platRepositories) {
        this.menuRepositories = menuRepositories;
        this.platRepositories = platRepositories;
    }

    @Override
    public List<Menu> getAllMenus() {
        return menuRepositories.findAll();
    }

    @Override
    public Menu getMenuById(Long id) {
        return menuRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu introuvable avec ID : " + id));
    }

    @Override
    public Menu createMenu(Menu menu) {
        if (menu.getPlats() != null && !menu.getPlats().isEmpty()) {
            List<Plat> plats = menu.getPlats().stream()
                    .map(p -> platRepositories.findById(p.getIdPlat())
                            .orElseThrow(() -> new RuntimeException("Plat introuvable avec ID : " + p.getIdPlat())))
                    .collect(Collectors.toList());
            menu.setPlats(plats);
        }
        return menuRepositories.save(menu);
    }

    @Override
    public Menu updateMenu(Long id, Menu newData) {
        Menu existing = menuRepositories.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu introuvable avec ID : " + id));

        if (newData.getNom() != null) existing.setNom(newData.getNom());
        if (newData.getDescription() != null) existing.setDescription(newData.getDescription());
        if (newData.getPrix() != 0) existing.setPrix(newData.getPrix());

        if (newData.getPlats() != null && !newData.getPlats().isEmpty()) {
            List<Plat> plats = newData.getPlats().stream()
                    .map(p -> platRepositories.findById(p.getIdPlat())
                            .orElseThrow(() -> new RuntimeException("Plat introuvable avec ID : " + p.getIdPlat())))
                    .collect(Collectors.toList());
            existing.setPlats(plats);
        }

        return menuRepositories.save(existing);
    }

    @Override
    public void deleteMenu(Long id) {
        if (!menuRepositories.existsById(id)) {
            throw new RuntimeException("Menu introuvable avec ID : " + id);
        }
        menuRepositories.deleteById(id);
    }
}
