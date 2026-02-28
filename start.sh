#!/usr/bin/env bash
# Script de inicio rápido para el sistema VR ArUco

echo "================================"
echo "🔷 Spatial Hand Tracking VR"
echo "================================"
echo ""

# Detectar sistema operativo
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    echo "🖥️  Windows detectado"
    echo ""
    echo "Opción 1: Generar marcador ArUco"
    echo "  > python generate_aruco.py"
    echo ""
    echo "Opción 2: Iniciar servidor"
    echo "  > python -m http.server 8000"
    echo ""
    echo "Luego abre en navegador:"
    echo "  • Flat mode: http://localhost:8000/index.html"
    echo "  • VR mode:   http://localhost:8000/vr-aruco.html"
else
    # Linux/Mac
    echo "🐧 Linux/Mac detectado"
    echo ""
    
    # Generar marcador
    echo "Generando marcador ArUco..."
    python3 generate_aruco.py || python generate_aruco.py
    
    echo ""
    echo "Iniciando servidor en puerto 8000..."
    echo "Abre en navegador: http://localhost:8000/vr-aruco.html"
    echo ""
    
    python3 -m http.server 8000 || python -m http.server 8000
fi
