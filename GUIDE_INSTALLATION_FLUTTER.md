# Guide d'Installation Flutter pour Windows

## 📋 Prérequis

1. **Windows 10 ou supérieur** (64-bit)
2. **Espace disque** : Au moins 2.8 GB (sans les outils IDE)
3. **Outils** :
   - Git pour Windows
   - PowerShell 5.0 ou supérieur
   - Windows Terminal (recommandé)

## 🚀 Installation Étape par Étape

### Étape 1 : Télécharger Flutter SDK

1. Allez sur : https://docs.flutter.dev/get-started/install/windows
2. Téléchargez le SDK Flutter (fichier ZIP)
   - Version stable recommandée
   - Taille : ~1.5 GB

### Étape 2 : Extraire Flutter

1. Extrayez le fichier ZIP dans un emplacement permanent
   - **Recommandé** : `C:\src\flutter`
   - ⚠️ **NE PAS** extraire dans :
     - Un dossier avec des espaces dans le chemin
     - `C:\Program Files\` (problèmes de permissions)
     - Un dossier nécessitant des privilèges élevés

### Étape 3 : Ajouter Flutter au PATH

#### Option A : Via l'Interface Graphique

1. Recherchez "Variables d'environnement" dans le menu Démarrer
2. Cliquez sur "Variables d'environnement"
3. Sous "Variables système", trouvez `Path` et cliquez sur "Modifier"
4. Cliquez sur "Nouveau"   
5. Ajoutez le chemin vers le dossier `bin` de Flutter :
   ```
   C:\src\flutter\bin
   ```
6. Cliquez sur "OK" sur toutes les fenêtres

#### Option B : Via PowerShell (Administrateur)

```powershell
# Ajouter Flutter au PATH utilisateur
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\src\flutter\bin", "User")
```

### Étape 4 : Vérifier l'Installation

1. **Fermez et rouvrez** votre terminal/PowerShell
2. Exécutez :
   ```powershell
   flutter --version
   ```
3. Vous devriez voir la version de Flutter

### Étape 5 : Exécuter Flutter Doctor

```powershell
flutter doctor
```

Cette commande vérifie votre environnement et indique ce qui manque.

### Étape 6 : Installer les Dépendances Manquantes

#### A. Android Studio (pour développement Android)

1. Téléchargez Android Studio : https://developer.android.com/studio
2. Installez Android Studio
3. Lancez Android Studio et suivez le setup wizard
4. Installez :
   - Android SDK
   - Android SDK Platform-Tools
   - Android Emulator

#### B. Visual Studio (pour développement Windows Desktop - Optionnel)

1. Installez Visual Studio 2022 Community (gratuit)
2. Sélectionnez le workload "Développement pour le bureau en C++"
3. Cochez :
   - Outils CMake pour Windows
   - SDK Windows 10/11

#### C. VS Code (Éditeur recommandé)

1. Téléchargez VS Code : https://code.visualstudio.com/
2. Installez l'extension Flutter :
   - Ouvrez VS Code
   - Allez dans Extensions (Ctrl+Shift+X)
   - Recherchez "Flutter"
   - Installez l'extension Flutter (installe aussi Dart automatiquement)

### Étape 7 : Accepter les Licences Android

```powershell
flutter doctor --android-licenses
```

Appuyez sur `y` pour accepter chaque licence.

### Étape 8 : Vérifier à Nouveau

```powershell
flutter doctor -v
```

Tous les éléments devraient être cochés (✓) :
- ✓ Flutter (channel stable)
- ✓ Android toolchain
- ✓ Chrome (pour web)
- ✓ Visual Studio (pour Windows desktop)
- ✓ Android Studio
- ✓ VS Code
- ✓ Connected device

## 🎯 Configuration pour Notre Projet

### Créer un Émulateur Android

1. Ouvrez Android Studio
2. Allez dans **Tools > Device Manager**
3. Cliquez sur **Create Device**
4. Sélectionnez un appareil (ex: Pixel 5)
5. Téléchargez une image système (ex: API 33)
6. Cliquez sur **Finish**

### Vérifier la Connexion

```powershell
flutter devices
```

Vous devriez voir votre émulateur listé.

## 🔧 Configuration Spécifique au Projet

### URL de l'API pour Mobile

Pour Android Emulator, utilisez :
```
http://10.0.2.2:8080/api
```

Pour iOS Simulator (si vous avez un Mac) :
```
http://localhost:8080/api
```

Pour un appareil physique :
```
http://VOTRE_IP_LOCALE:8080/api
```

Pour trouver votre IP locale :
```powershell
ipconfig
# Cherchez "Adresse IPv4" sous votre connexion réseau
```

## ✅ Vérification Finale

Exécutez ces commandes pour vérifier que tout fonctionne :

```powershell
# Version Flutter
flutter --version

# Vérifier l'environnement
flutter doctor

# Lister les appareils disponibles
flutter devices

# Tester avec un projet exemple
flutter create test_app
cd test_app
flutter run
```

## 🐛 Problèmes Courants

### Flutter non reconnu
- Vérifiez que Flutter est dans le PATH
- Redémarrez votre terminal
- Redémarrez votre ordinateur si nécessaire

### Erreur "cmdline-tools component is missing"
```powershell
# Dans Android Studio : Tools > SDK Manager > SDK Tools
# Cochez "Android SDK Command-line Tools"
```

### Erreur de licence Android
```powershell
flutter doctor --android-licenses
# Acceptez toutes les licences
```

### Problème de connexion à l'API
- Vérifiez que le backend Spring Boot tourne
- Vérifiez l'IP dans la configuration
- Vérifiez le firewall Windows

## 📚 Ressources

- Documentation Flutter : https://docs.flutter.dev/
- Flutter Cookbook : https://docs.flutter.dev/cookbook
- Packages Flutter : https://pub.dev/

## 🎉 Prochaines Étapes

Une fois Flutter installé, nous pourrons :
1. Créer le projet Flutter
2. Configurer la structure
3. Implémenter les fonctionnalités
4. Tester sur l'émulateur

