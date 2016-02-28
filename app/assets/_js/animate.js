window.THREE = require('three');
require('./lib/DeviceOrientationControls');
require('./lib/OrbitControls');

// Needs renderer, scene, camera

var animate = function animate() {

  var renderer = window.vrmanchester.renderer;
  var scene = window.vrmanchester.scene;
  var camera = window.vrmanchester.camera;
  var controls = window.vrmanchester.controls;

  window.requestAnimationFrame( animate );
  controls.update();
  renderer.render(scene, camera);


};

module.exports = animate;
