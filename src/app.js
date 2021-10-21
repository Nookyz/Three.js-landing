import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import imagesLoaded from 'imagesloaded';
import FontFaceObserver from 'fontfaceobserver';

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

import t1 from '../assets/images/1.jpg'
import t2 from '../assets/images/2.jpg'



export default class Sketch {
  constructor(options){
    this.container = options.dom

    console.log('this.container', this.container)

    this.scene = new THREE.Scene()

    // this.width = this.container.offsetWidth
    // this.height = this.container.offsetHeight
    this.width = window.innerWidth
    this.height = window.innerHeight

    console.log('this.container.offsetWidth', this.container.offsetWidth)
    console.log('this.container.offsetHeight', this.container.offsetHeight)

    console.log('this.width', this.width)
    console.log('this.height', this.height)

    console.log('innerHTML', this.container.innerHTML)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    this.renderer.setSize( this.width, this.height )
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.container.appendChild(this.renderer.domElement)

    this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 100, 2000 )
    this.camera.position.z = 600

    this.camera.fov = 2 * Math.atan((this.height / 2) / 600) * (180 / Math.PI)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.images = [...document.querySelectorAll('img')]

    this.time = 0
    
    const fontOpen = new Promise(resolve => {
      new FontFaceObserver("Open Sans").load().then(() => {
        resolve();
      });
    });

    const fontPlayfair = new Promise(resolve => {
      new FontFaceObserver("Playfair Display").load().then(() => {
        resolve();
      });
    });

    // Preload images
    const preloadImages = new Promise((resolve, reject) => {
      imagesLoaded(document.querySelectorAll("img"), { background: true }, resolve);
    });

    let allDone = [fontOpen,fontPlayfair,preloadImages]

    Promise.all(allDone).then(()=>{
      this.addImages()
      this.setPosition()

      this.resize()
      this.setupRezise()
      // this.addObjects()
      this.render()
    })
  }

  setupRezise(){
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    // this.width = this.container.offsetWidth
    // this.height = this.container.offsetHeight
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addImages(){
    this.imageStore = this.images.map(img => {
      let bounds = img.getBoundingClientRect()

      let geometry = new THREE.PlaneBufferGeometry(bounds.width, bounds.height, 1, 1)
      let texture = new THREE.Texture(img)
      texture.needsUpdate = true
      let material = new THREE.MeshBasicMaterial({
        map: texture
      })

      let mesh = new THREE.Mesh(geometry, material)

      this.scene.add(mesh)

      // console.log(bounds)

      return {
        img: img,
        mesh: mesh,
        top: bounds.top,
        left: bounds.left,
        width: bounds.width,
        height: bounds.height
      }
    })
  }

  setPosition(){
    this.imageStore.forEach((o) => {
      o.mesh.position.y = -o.top + this.height / 2 - o.height / 2
      o.mesh.position.x = o.left - this.width / 2 + o.width / 2
    })
  }

  addObjects(){
    this.geometry = new THREE.PlaneBufferGeometry(200, 300, 10, 10)
    // this.geometry = new THREE.SphereBufferGeometry(0.5, 50, 50)

    this.material = new THREE.ShaderMaterial({
      uniforms: { 
        time: { value: 0 },
        t1: { value: new THREE.TextureLoader().load(t1) }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
      wireframe: true,
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
	  this.scene.add( this.mesh )
  }

  render(){
    this.time += 0.02

    // this.mesh.rotation.x = this.time / 2000
	  // this.mesh.rotation.y = this.time / 1000

    this.material.uniforms.time.value = this.time

    this.renderer.render(this.scene, this.camera)
    
    window.requestAnimationFrame(this.render.bind(this))
  }
}

const dom = document.getElementById('canvas')

new Sketch({
  dom
})