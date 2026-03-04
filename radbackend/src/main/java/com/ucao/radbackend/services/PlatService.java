package com.ucao.radbackend.services;

import com.ucao.radbackend.entities.Plat;
import java.util.List;

public interface PlatService {

    List<Plat> getAllPlats();

    Plat getPlatById(Long id);

    Plat createPlat(Plat plat);

    Plat updatePlat(Long id, Plat plat);

    void deletePlat(Long id);
}
