package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.Menu;
import java.util.List;

public interface MenuService {

    List<Menu> getAllMenus();

    Menu getMenuById(Long id);

    Menu createMenu(Menu menu);

    Menu updateMenu(Long id, Menu menu);

    void deleteMenu(Long id);
}
