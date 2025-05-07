// Scene elements
let scene, camera, renderer

// 3D objects
let cube, sphere, cylinder

// Control variables
let isRotating = true
let rotationSpeed = 0.01
let scaleDirection = 1
let scaleSpeed = 0.005
let scaleMin = 0.5
let scaleMax = 1.5

function init () {
  // Setup scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x222233) // Dark blue background

  // Setup camera
  camera = new THREE.PerspectiveCamera(
    75, // Field of view (FOV)
    window.innerWidth / window.innerHeight, // Screen ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
  )
  camera.position.z = 15 // Initial camera position

  // Setup renderer
  renderer = new THREE.WebGLRenderer({ antialias: true }) // Antialiasing for smooth edges
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio) // For high-res screens
  document.body.appendChild(renderer.domElement)

  // Add objects to scene
  createObjects()

  // Add lights
  createLights()

  // Setup camera controls
  setupControls()

  // window resize
  window.addEventListener('resize', onWindowResize)

  // Start animation loop
  animate()
}

// Create 3D objects
function createObjects () {
  // 1. Cube with texture
  const textureLoader = new THREE.TextureLoader()
  const cubeTexture = textureLoader.load(
    'https://threejs.org/examples/textures/crate.gif'
  )

  const cubeGeometry = new THREE.BoxGeometry(3, 3, 3)
  const cubeMaterial = new THREE.MeshPhongMaterial({
    map: cubeTexture,
    shininess: 50
  })
  cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
  cube.position.set(-5, 0, 0) // Position left
  scene.add(cube)

  // 2. Green sphere
  const sphereGeometry = new THREE.SphereGeometry(2, 32, 32)
  const sphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff88,
    shininess: 100,
    specular: 0x444444
  })
  sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
  sphere.position.set(0, 3, 0) // Position up
  scene.add(sphere)

  // 3. Blue cylinder
  const cylinderGeometry = new THREE.CylinderGeometry(1, 1.5, 4, 32)
  const cylinderMaterial = new THREE.MeshPhongMaterial({
    color: 0x2233ff,
    shininess: 70,
    specular: 0x555555
  })
  cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
  cylinder.position.set(5, -1, 0) // Position right
  cylinder.rotation.x = Math.PI / 6 // Tilt the cylinder
  scene.add(cylinder)
}

// Setup different lights in scene
function createLights () {
  // Ambient light - soft global light
  const ambientLight = new THREE.AmbientLight(0x333333)
  scene.add(ambientLight)

  // Directional light - like sunlight, from one direction
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(5, 10, 7)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // Point light - emits light in all directions from a point
  const pointLight = new THREE.PointLight(0xffffcc, 0.8, 100)
  pointLight.position.set(-8, 5, 10)
  scene.add(pointLight)
}

// Setup keyboard and mouse controls
function setupControls () {
  // Event listener for camera and object controls
  document.addEventListener('keydown', function (event) {
    const speed = 0.5 // Camera move speed

    // Camera move controls: WASD + QE
    switch (event.key) {
      case 'w':
        camera.position.z -= speed
        break
      case 's':
        camera.position.z += speed
        break
      case 'a':
        camera.position.x -= speed
        break
      case 'd':
        camera.position.x += speed
        break
      case 'q':
        camera.position.y += speed
        break
      case 'e':
        camera.position.y -= speed
        break

      // Toggle object rotation
      case ' ':
        isRotating = !isRotating
        break

      // Scale controls (+ and -)
      case '+':
      case '=': // = key used without shift for +
        scaleObjects(0.1)
        break
      case '-':
        scaleObjects(-0.1)
        break
    }
  })
}

// Apply scale to objects with delta
function scaleObjects (delta) {
  // Apply scale to 3 objects with limits
  const applyScaleTo = obj => {
    const newScale = obj.scale.x + delta
    if (newScale >= scaleMin && newScale <= scaleMax) {
      obj.scale.set(newScale, newScale, newScale)
    }
  }

  applyScaleTo(cube)
  applyScaleTo(sphere)
  applyScaleTo(cylinder)
}

/**
 * Adjust renderer size on window resize
 */
function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// Animation loop
function animate () {
  requestAnimationFrame(animate)

  // Apply rotation if enabled
  if (isRotating) {
    // Cube rotation on two axes
    cube.rotation.x += rotationSpeed
    cube.rotation.y += rotationSpeed * 1.2

    // Sphere rotation on one axis
    sphere.rotation.y += rotationSpeed * 0.7

    // Cylinder rotation on multiple axes
    cylinder.rotation.z += rotationSpeed * 0.5
    cylinder.rotation.y += rotationSpeed * 0.3
  }

  // Oscillating scale animation
  sphere.scale.x =
    sphere.scale.y =
    sphere.scale.z =
      1.0 + Math.sin(Date.now() * 0.001) * 0.1

  // Render scene with current camera
  renderer.render(scene, camera)
}

// Start app on page load
window.onload = init
