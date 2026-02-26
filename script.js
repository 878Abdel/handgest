// Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const cursor = document.getElementById('cursor');
const pinchIndicator = document.getElementById('pinchIndicator');
const status = document.getElementById('status');
const posEl = document.getElementById('pos');
const pinchEl = document.getElementById('pinch');
const stateEl = document.getElementById('state');
const cameraEl = document.getElementById('camera');
const showLandmarks = document.getElementById('showLandmarks');
const showConnections = document.getElementById('showConnections');
const testBtn = document.getElementById('testBtn');
const output = document.getElementById('output');
const actionLog = document.getElementById('actionLog');
const scrollArea = document.getElementById('scrollArea');

// State
let isPinching = false;
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
let cursorX = 0;
let cursorY = 0;
let frameCount = 0;
let lastTime = Date.now();
let fps = 0;
let lastPinchY = 0;
let hoveredElement = null;
let lastClickTime = 0;
let wasScrolling = false;

// Config
const PINCH_THRESHOLD = 35;
const CURSOR_SMOOTHING = 0.3;
const SCROLL_SPEED = 2;
const SCROLL_THRESHOLD = 5;
const CLICK_COOLDOWN = 300;

// Canvas setup
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Distance
function distance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Landmark to screen
function toScreen(landmark) {
  return {
    x: isMobile ? landmark.x * canvas.width : (1 - landmark.x) * canvas.width,
    y: landmark.y * canvas.height
  };
}

// Draw point
function drawPoint(pos, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
  ctx.fill();
}

// Draw line
function drawLine(p1, p2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

// Draw connections
function drawHandConnections(landmarks) {
  const connections = [
    [0,1],[1,2],[2,3],[3,4],
    [0,5],[5,6],[6,7],[7,8],
    [0,9],[9,10],[10,11],[11,12],
    [0,13],[13,14],[14,15],[15,16],
    [0,17],[17,18],[18,19],[19,20],
    [5,9],[9,13],[13,17]
  ];
  
  connections.forEach(([i, j]) => {
    const p1 = toScreen(landmarks[i]);
    const p2 = toScreen(landmarks[j]);
    drawLine(p1, p2, 'rgba(255,255,255,0.2)', 1);
  });
}

// Process hand
function processHand(landmarks) {
  const indexTip = landmarks[8];
  const thumbTip = landmarks[4];
  
  const indexPos = toScreen(indexTip);
  const thumbPos = toScreen(thumbTip);
  
  // Update cursor with smoothing
  cursorX += (indexPos.x - cursorX) * CURSOR_SMOOTHING;
  cursorY += (indexPos.y - cursorY) * CURSOR_SMOOTHING;
  
  cursor.style.left = (cursorX - 5) + 'px';
  cursor.style.top = (cursorY - 5) + 'px';
  cursor.classList.add('active');
  
  // Detect hovered element
  hoveredElement = getElementUnderCursor(cursorX, cursorY);
  
  // Remove hover class from all interactive elements
  document.querySelectorAll('.interactive-btn, .interactive-check, .win-btn').forEach(el => {
    el.classList.remove('hover');
  });
  
  // Visual feedback for hover
  if (hoveredElement) {
    cursor.style.borderColor = '#ffff00';
    cursor.style.boxShadow = '0 0 8px #ffff00';
    hoveredElement.classList.add('hover');
  } else {
    cursor.style.borderColor = '#fff';
    cursor.style.boxShadow = '0 0 3px rgba(255, 255, 255, 0.8)';
  }
  
  // Update position
  posEl.textContent = `${Math.round(indexPos.x)}, ${Math.round(indexPos.y)}`;
  
  // Detect pinch
  const dist = distance(indexPos, thumbPos);
  pinchEl.textContent = Math.round(dist);
  
  const wasPinching = isPinching;
  isPinching = dist < PINCH_THRESHOLD;
  
  if (isPinching) {
    cursor.classList.add('pinch');
    
    // Show indicator
    const midX = (indexPos.x + thumbPos.x) / 2;
    const midY = (indexPos.y + thumbPos.y) / 2;
    const radius = dist * 0.5;
    
    pinchIndicator.style.left = (midX - radius) + 'px';
    pinchIndicator.style.top = (midY - radius) + 'px';
    pinchIndicator.style.width = (radius * 2) + 'px';
    pinchIndicator.style.height = (radius * 2) + 'px';
    pinchIndicator.classList.add('active');
    
    if (!wasPinching) {
      log('🫴 Pincement détecté');
      lastPinchY = cursorY;
      
      // Click on element
      if (hoveredElement) {
        clickElement(hoveredElement);
      }
    } else {
      // Scroll detection
      const deltaY = cursorY - lastPinchY;
      
      if (Math.abs(deltaY) > SCROLL_THRESHOLD) {
        if (scrollArea) {
          scrollArea.scrollTop -= deltaY * SCROLL_SPEED;
          stateEl.textContent = deltaY < 0 ? '↓ Défilement bas' : '↑ Défilement haut';
          
          if (!wasScrolling) {
            logAction(`📜 Défilement ${deltaY < 0 ? 'vers bas' : 'vers haut'}`);
            wasScrolling = true;
          }
        }
        lastPinchY = cursorY;
      } else {
        stateEl.textContent = 'Pincement';
      }
    }
  } else {
    cursor.classList.remove('pinch');
    stateEl.textContent = 'Repos';
    pinchIndicator.classList.remove('active');
    wasScrolling = false;
    
    if (wasPinching) {
      log('✋ Pincement relâché');
    }
  }
  
  // Draw landmarks
  if (showLandmarks.checked) {
    landmarks.forEach((lm, i) => {
      const pos = toScreen(lm);
      const fingerTips = [4,8,12,16,20];
      const size = fingerTips.includes(i) ? 3 : 2;
      const alpha = fingerTips.includes(i) ? 0.8 : 0.5;
      drawPoint(pos, size, `rgba(255,255,255,${alpha})`);
    });
  }
}

// On results
function onResults(results) {
  // FPS calculation
  frameCount++;
  const now = Date.now();
  if (now - lastTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = now;
  }
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    status.textContent = `Aucune main | ${fps} FPS`;
    cursor.classList.remove('active');
    return;
  }
  
  status.textContent = `${results.multiHandLandmarks.length} main(s) | ${fps} FPS`;
  
  const hand = results.multiHandLandmarks[0];
  
  if (showConnections.checked) {
    drawHandConnections(hand);
  }
  
  processHand(hand);
}

// Log
function log(text) {
  const line = document.createElement('div');
  line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  output.insertBefore(line, output.firstChild);
  
  while (output.children.length > 5) {
    output.removeChild(output.lastChild);
  }
}

function logAction(text) {
  if (!actionLog) return;
  const line = document.createElement('div');
  line.textContent = `${new Date().toLocaleTimeString()} - ${text}`;
  actionLog.insertBefore(line, actionLog.firstChild);
  
  while (actionLog.children.length > 8) {
    actionLog.removeChild(actionLog.lastChild);
  }
}

// Detect element under cursor
function getElementUnderCursor(x, y) {
  const elements = document.elementsFromPoint(x, y);
  return elements.find(el => 
    el.classList.contains('interactive-btn') ||
    el.classList.contains('interactive-check') ||
    el.classList.contains('win-btn')
  );
}

// Click element
function clickElement(element) {
  if (!element) return;
  
  const now = Date.now();
  if (now - lastClickTime < CLICK_COOLDOWN) return;
  lastClickTime = now;
  
  if (element.classList.contains('interactive-btn')) {
    element.classList.add('clicked');
    setTimeout(() => element.classList.remove('clicked'), 150);
    
    const action = element.getAttribute('data-action');
    logAction(`🖱️ Clic: ${action || 'bouton'}`);
    
    if (action === 'like') logAction('👍 J\'aime!');
    else if (action === 'dislike') logAction('👎 Pas aimer');
    else if (action === 'share') logAction('🔗 Partagé');
    else if (action === 'save') logAction('💾 Sauvegardé');
    else if (action === 'submit') logAction('✓ Validé');
    else if (action === 'reset') logAction('✕ Annulé');
  } else if (element.type === 'checkbox') {
    element.checked = !element.checked;
    logAction(`☑️ ${element.checked ? 'Coché' : 'Décoché'}: ${element.id}`);
  }
}

// Test button
testBtn.addEventListener('click', () => {
  log('✓ Bouton cliqué');
});

// Init MediaPipe
const hands = new Hands({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.7,
  minTrackingConfidence: 0.7
});

hands.onResults(onResults);

// Camera setup
status.textContent = 'Accès caméra...';
cameraEl.textContent = isMobile ? 'Arrière' : 'Frontale';

const camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({ image: video });
  },
  width: 1280,
  height: 720,
  facingMode: isMobile ? 'environment' : 'user'
});

camera.start()
  .then(() => {
    status.textContent = isMobile ? '📱 Prêt (Mobile)' : '🖥️ Prêt (Desktop)';
    cameraEl.textContent = isMobile ? '✓ Arrière' : '✓ Frontale';
  })
  .catch((err) => {
    status.textContent = '❌ Erreur: ' + err.message;
    cameraEl.textContent = '✗ Erreur';
  });