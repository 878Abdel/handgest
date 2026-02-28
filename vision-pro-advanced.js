// ==================== VISION PRO AI - ADVANCED MODULE ====================
// Détection ArUco avancée + Gestes sophistiqués

class VisionProAdvanced {
  constructor() {
    this.arucoDetector = null;
    this.gestureBuffer = [];
    this.bufferSize = 5;
    this.initAruco();
  }

  initAruco() {
    // Attendre que OpenCV soit chargé
    if (typeof cv !== 'undefined') {
      console.log('✓ OpenCV détecté');
      this.setupAruco();
    } else {
      setTimeout(() => this.initAruco(), 500);
    }
  }

  setupAruco() {
    try {
      if (cv.aruco) {
        this.arucoDetector = cv.aruco.getPredefinedDictionary(cv.aruco.DICT_5X5_250);
        console.log('✓ ArUco Detector initialisé');
      }
    } catch (e) {
      console.log('⚠ ArUco non disponible, utilisation du mode simplifié');
    }
  }

  // ==================== ARUCO DETECTION ====================
  detectArucoMarker(frame) {
    if (!this.arucoDetector || !frame) return null;

    try {
      let src = cv.imread(frame);
      let gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // Détecte les marqueurs
      let detector = new cv.aruco.ArucoDetector(this.arucoDetector);
      let corners = new cv.MatVector();
      let ids = new cv.Mat();

      detector.detectMarkers(gray, corners, ids);

      if (ids.rows > 0) {
        const markerId = ids.intAt(0, 0);
        const cornerPoints = [];
        
        for (let i = 0; i < 4; i++) {
          cornerPoints.push({
            x: corners.get(0).doubleAt(i * 2),
            y: corners.get(0).doubleAt(i * 2 + 1)
          });
        }

        const center = {
          x: (cornerPoints[0].x + cornerPoints[1].x + cornerPoints[2].x + cornerPoints[3].x) / 4,
          y: (cornerPoints[0].y + cornerPoints[1].y + cornerPoints[2].y + cornerPoints[3].y) / 4
        };

        cv.Mat.delete(src);
        cv.Mat.delete(gray);
        ids.delete();
        corners.delete();

        return { detected: true, id: markerId, center, corners: cornerPoints };
      }

      cv.Mat.delete(src);
      cv.Mat.delete(gray);
      ids.delete();
      corners.delete();

      return { detected: false };
    } catch (e) {
      console.warn('ArUco detection error:', e);
      return { detected: false };
    }
  }

  // ==================== ADVANCED GESTURE RECOGNITION ====================
  analyzeGestureSequence(landmarks, handedness) {
    if (!landmarks) return null;

    const gesture = {
      handedness,
      thumbExtended: this.isThumbExtended(landmarks),
      indexExtended: this.isIndexExtended(landmarks),
      openHand: this.isOpenHand(landmarks),
      pointingGesture: this.isPointingGesture(landmarks),
      okGesture: this.isOKGesture(landmarks),
      peaceSigns: this.isPeaceSign(landmarks),
      victory: this.isVictory(landmarks)
    };

    return gesture;
  }

  isThumbExtended(landmarks) {
    const thumb = landmarks[4];
    const wrist = landmarks[0];
    return Math.abs(thumb.x - wrist.x) > 0.15;
  }

  isIndexExtended(landmarks) {
    const indexTip = landmarks[8];
    const indexBase = landmarks[5];
    const middleTip = landmarks[12];
    return Math.abs(indexTip.y - indexBase.y) > 0.1 && indexTip.y < middleTip.y;
  }

  isOpenHand(landmarks) {
    const fingers = [8, 12, 16, 20];
    let extended = 0;
    fingers.forEach(idx => {
      if (landmarks[idx].y < landmarks[idx - 3].y) extended++;
    });
    return extended >= 3;
  }

  isPointingGesture(landmarks) {
    return this.isIndexExtended(landmarks) && !this.isOpenHand(landmarks);
  }

  isOKGesture(landmarks) {
    const thumb = landmarks[4];
    const index = landmarks[8];
    const otherFingers = [12, 16, 20];
    
    const distance = Math.hypot(thumb.x - index.x, thumb.y - index.y);
    let otherExtended = 0;
    
    otherFingers.forEach(idx => {
      if (landmarks[idx].y < landmarks[idx - 3].y) otherExtended++;
    });

    return distance < 0.08 && otherExtended >= 2;
  }

  isPeaceSign(landmarks) {
    const index = landmarks[8].y < landmarks[5].y;
    const middle = landmarks[12].y < landmarks[9].y;
    const ring = landmarks[16].y > landmarks[13].y;
    const pinky = landmarks[20].y > landmarks[17].y;
    
    return index && middle && ring && pinky;
  }

  isVictory(landmarks) {
    return this.isPeaceSign(landmarks) && 
           Math.abs(landmarks[8].x - landmarks[12].x) > 0.08;
  }

  // ==================== HAND SMOOTHING ====================
  smoothLandmarks(landmarks, alpha = 0.7) {
    return landmarks.map(point => ({
      x: point.x,
      y: point.y,
      z: point.z || 0
    }));
  }

  // ==================== DISTANCE CALCULATIONS ====================
  calculateDistance(p1, p2) {
    return Math.hypot(
      (p1.x - p2.x) * window.innerWidth,
      (p1.y - p2.y) * window.innerHeight
    );
  }

  // ==================== TWO-HAND INTERACTIONS ====================
  detectTwoHandGestures(hands) {
    if (hands.length < 2) return null;

    const hand1 = hands[0];
    const hand2 = hands[1];

    const thumbDist = this.calculateDistance(hand1[4], hand2[4]);
    const pinkyDist = this.calculateDistance(hand1[20], hand2[20]);

    return {
      thumbDistance: thumbDist,
      pinkyDistance: pinkyDist,
      handSpan: thumbDist,
      isZoom: Math.abs(thumbDist - 200) < 50,
      isRotate: Math.abs(hand1[0].x - hand2[0].x) < 0.15
    };
  }

  // ==================== INTERACTION ZONES ====================
  checkInteractionZone(landmarks, uiPosition, uiSize) {
    if (!landmarks || !landmarks[8]) return false;

    const indexTip = landmarks[8];
    const screenX = (1 - indexTip.x) * window.innerWidth;
    const screenY = indexTip.y * window.innerHeight;

    return (
      screenX > uiPosition.x &&
      screenX < uiPosition.x + uiSize.width &&
      screenY > uiPosition.y &&
      screenY < uiPosition.y + uiSize.height
    );
  }
}

// ==================== EXPORT ====================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisionProAdvanced;
}
