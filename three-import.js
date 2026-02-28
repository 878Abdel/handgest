// Wrapper pour charger le module Three.js et l'exposer globalement
import * as THREE from './three.module.js';

// Exposer THREE globalement et signaler que c'est prêt
window.THREE = THREE;
window.THREE_READY = true;

console.log('✅ three-import.js: THREE exposé globalement avec', Object.keys(THREE).length, 'propriétés');
console.log('✓ THREE.REVISION:', THREE.REVISION);
console.log('✓ THREE.Scene existe:', typeof THREE.Mesh !== 'undefined');
console.log('✓ THREE.WebGLRenderer existe:', typeof THREE.WebGLRenderer !== 'undefined');
