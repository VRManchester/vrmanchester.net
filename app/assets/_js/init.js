window.THREE = require('three');
require('./lib/DeviceOrientationControls');
require('./lib/OrbitControls');

// needs a container to apply renderer to.

var init = function init () {

  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer();

  var container = document.getElementById( 'container' );
  var scene;

  var camera;
  var controls;

  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = 0;
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
  camera.position.z = 1;

  controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.enableZoom = false;

  // Our preferred controls via DeviceOrientation
  function setOrientationControls(e) {
    if (!e.alpha) {
      return;
    }
    controls = new THREE.DeviceOrientationControls(camera);
    camera.position.z = 0;
    // controls.connect();
    // controls.update();
    // element.addEventListener('click', fullscreen, false);
    window.removeEventListener('deviceorientation', setOrientationControls, true);
  }
  window.addEventListener('deviceorientation', setOrientationControls, true);


  var geometry = new THREE.SphereGeometry( 500, 16, 8 );
  geometry.scale( - 1, 1, 1 );

  var material = new THREE.MeshBasicMaterial( {
    map: new THREE.TextureLoader().load( '/images/environment_06.jpg' )
  } );
  // material.anisotropy = renderer.getMaxAnisotropy();

  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  var geometry = new THREE.BoxGeometry( 100, 100, 100, 4, 4, 4 );
  var material = new THREE.MeshBasicMaterial( { color: 0x0000ff, side: THREE.BackSide, wireframe: true } );
  var mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  window.vrmanchester = {
    scene: scene,
    renderer: renderer,
    container: container,
    scene: scene,
    camera: camera,
    controls: controls
  }

}

module.exports = init;
