import cv2
import cv2.aruco as aruco

# 1. Définir le dictionnaire (on utilise le 5x5 avec 100 variantes pour compatibilité avec vr-aruco.js)
aruco_dict = aruco.getPredefinedDictionary(aruco.DICT_5X5_100)

# 2. Paramètres du marqueur
marker_id = 0      # L'identifiant demandé
marker_size = 400  # Taille en pixels (400x400)

# 3. Générer l'image du marqueur
# drawMarker(dictionnaire, id, taille_pixels)
marker_image = aruco.generateImageMarker(aruco_dict, marker_id, marker_size)

# 4. Sauvegarder l'image
file_name = "aruco_marker_id_0.png"
cv2.imwrite(file_name, marker_image)

print(f"Succès ! Le marqueur '{file_name}' a été généré.")