# 🎯 Écran Virtuel AR - ArUco

Application AR simple: caméra webcam + écran virtuel 3D qui se fixe au marqueur ArUco.

---

## 🚀 Démarrage rapide

**1. Générer le marqueur ArUco**
```bash
python generate_aruco.py
```
Cela crée `aruco_marker_id_0.png` - imprimez-le ou affichez-le sur un écran.

**2. Lancer l'application**
```bash
python -m http.server 8000
```

**3. Ouvrir dans votre navigateur**
```
http://localhost:8000/index.html
```

**4. Utilisation**
- Autoriser l'accès caméra
- Montrer le marqueur ArUco à la caméra
- L'écran virtuel apparaît et suit le marqueur !

---

## 📦 Ce qu'il y a dans ce projet

```
handgest/
├── index.html          ← Application principale (TOUT-EN-UN)
├── generate_aruco.py   ← Générateur de marqueurs
├── aruco_marker_id_0.png ← Votre marqueur (à imprimer)
├── START.bat           ← Lanceur automatique Windows
└── README.md           ← Ce fichier
```

---

## ✨ Fonctionnalités

- **Webcam en direct** - Flux vidéo en arrière-plan
- **Détection ArUco** - OpenCV.js détecte les marqueurs en temps réel
- **Écran 3D** - Panneau virtuel avec Three.js
- **Position automatique** - L'écran suit et se fixe au marqueur
- **HUD en temps réel** - Affiche statut, position, FPS

---

## 🛠️ Technologies utilisées

- **Three.js** - Rendu 3D de l'écran virtuel
- **OpenCV.js** - Détection des marqueurs ArUco
- **WebGL** - Accélération matérielle
- **getUserMedia** - Accès webcam

---

## 📝 Comment ça marche

1. La webcam capture le flux vidéo en continu
2. OpenCV.js analyse chaque frame pour détecter le marqueur ArUco
3. Quand détecté, calcule la position (X, Y, Z) du marqueur
4. L'écran 3D se positionne automatiquement à cet emplacement
5. L'écran suit doucement le marqueur si vous le bougez

---

## ⚙️ Configuration requise

- **Navigateur moderne** : Chrome 90+, Firefox 88+, Edge 90+
- **Webcam fonctionnelle**
- **Python 3.7+** (pour générer les marqueurs)
- **Connexion internet** (pour charger les librairies CDN)

---

## 🔧 Dépannage

### Caméra ne démarre pas
- Vérifier les permissions du navigateur
- Fermer les autres applications utilisant la caméra
- Actualiser la page

### Marqueur ArUco non détecté
- **Améliorer l'éclairage** - Le marqueur doit être bien éclairé
- **Imprimer plus grand** - Essayer format A4 ou plus
- **Tenir droit** - Le marqueur doit être face à la caméra
- **Se rapprocher** - Le marqueur doit être visible et net

### OpenCV ne charge pas
- Attendre 3-5 secondes (chargement depuis CDN)
- Vérifier la connexion internet
- Ouvrir la console DevTools (F12) pour voir les erreurs

### Performances faibles
- Fermer les autres onglets du navigateur
- Réduire la résolution de la webcam
- Utiliser un GPU plus puissant si possible

---

## 🎨 Personnalisation

Vous pouvez modifier `index.html` pour :

- **Changer la couleur de l'écran** : Modifier `color: 0x1a1a2e` (ligne ~247)
- **Changer la taille de l'écran** : Modifier `BoxGeometry(4, 2.5, 0.1)` (ligne ~244)
- **Changer le contenu** : Modifier le canvas à partir de la ligne ~280
- **Ajuster la sensibilité** : Modifier `* 0.1` (ligne ~445 - interpolation)

---

## 🎥 Utilisation avancée

### Afficher du contenu personnalisé

L'écran virtuel peut afficher n'importe quel contenu. Modifiez la section `createVirtualScreen()` pour :
- Afficher une image
- Afficher une vidéo
- Afficher un site web (via texture)
- Afficher du texte dynamique

### Plusieurs marqueurs

Pour détecter plusieurs marqueurs simultanément :
1. Générer plusieurs marqueurs avec des IDs différents
2. Modifier le code de détection pour boucler sur tous les marqueurs
3. Créer un écran 3D pour chaque marqueur

---

## 📞 Support

Ouvrez la console développeur (F12) pour voir les logs en temps réel :
- `✓ OpenCV.js chargé` - OpenCV prêt
- `✓ Caméra initialisée` - Webcam active
- `✓ Marqueur ArUco détecté !` - Détection réussie
- `✗ Marqueur perdu` - Plus de détection

---

## 📄 Licences

- Three.js : MIT License
- OpenCV.js : BSD License

---

✨ **Projet simplifié - Version AR minimale** - Février 2026

