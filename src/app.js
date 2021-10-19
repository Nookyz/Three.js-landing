import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

export default class Sketch {
  constructor(options){

    this.container = options.dom

    this.scene = new THREE.Scene()

    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight

    this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 0.01, 10 )
    this.camera.position.z = 1

    this.renderer = new THREE.WebGLRenderer( { antialias: true } )
    this.renderer.setSize( this.width, this.height )
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.time = 0

    this.resize()
    this.setupRezise()
    this.addObjects()
    this.render()
  }

  setupRezise(){
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addObjects(){
    this.geometry = new THREE.PlaneBufferGeometry(0.6, 0.6, 16, 16)

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      wireframe: true,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
	  this.scene.add( this.mesh )
  }

  render(){
    this.time += 0.05

    // this.mesh.rotation.x += 0.01
	  // this.mesh.rotation.y += 0.02

    this.renderer.render(this.scene, this.camera)
    
    window.requestAnimationFrame(this.render.bind(this))
  }
}

new Sketch({
  dom: document.getElementById('app')
})
