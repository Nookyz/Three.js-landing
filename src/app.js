import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import imagesLoaded from 'imagesloaded'
import FontFaceObserver from 'fontfaceobserver'
import gsap from 'gsap'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import Scroll from './scroll';

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'
import noise from './shaders/noise.glsl'

import t1 from '../assets/images/1.jpg'
import t2 from '../assets/images/2.jpg'



export default class Sketch {
  constructor(options){
    this.container = options.dom

    this.scene = new THREE.Scene()

    // this.width = this.container.offsetWidth
    // this.height = this.container.offsetHeight
    this.width = window.innerWidth
    this.height = window.innerHeight

    console.log('this.width', this.width)
    console.log('this.height', this.height)

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

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.images = [...document.querySelectorAll('img')]

    this.time = 0

    this.currentScroll = 0;
    this.previousScroll = 0
    
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
      this.scroll = new Scroll()

      this.addImages()
      this.setPosition()

      
      this.onMouseMove()
      this.resize()
      this.setupRezise()
      // this.addObjects()

      this.composerPass()
      this.render()
    })
  }

  composerPass(){
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    //custom shader pass
    var counter = 0.0;
    this.myEffect = {
      uniforms: {
        "tDiffuse": { value: null },
        "scrollSpeed": { value: null },
        "time": { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix 
            * modelViewMatrix 
            * vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform float scrollSpeed;
        uniform float time;

        ${noise}

        void main(){
          vec2 newUV = vUv;
          float area = smoothstep(1.0, 0.8,vUv.y) * 2.0 - 1.0;
          // area = pow(area,4.);

          float noise = 0.5 * (cnoise(vec3(vUv * 10.0, time / 3.0)) + 1.0);
          float n = smoothstep(0.5, 0.5, noise + area);

          newUV.x -= (vUv.x - 0.5)*0.1*area*scrollSpeed;
          gl_FragColor = texture2D( tDiffuse, newUV);
          // gl_FragColor = vec4(n, 0.0, 0.0, 1.0);

          gl_FragColor = mix(vec4(1.0), texture2D( tDiffuse, newUV), n);
        }
      `
    }

    this.customPass = new ShaderPass(this.myEffect);
    this.customPass.renderToScreen = true;

    this.composer.addPass(this.customPass);
  }

  onMouseMove(){
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = ( event.clientX / this.width ) * 2 - 1;
	    this.mouse.y = - ( event.clientY / this.height ) * 2 + 1;

      // update the picking ray with the camera and mouse position
      this.raycaster.setFromCamera( this.mouse, this.camera );

      // calculate objects intersecting the picking ray
      const intersects = this.raycaster.intersectObjects( this.scene.children );

      if(intersects.length > 0){
        let obj = intersects[0].object
        obj.material.uniforms.hover.value = intersects[0].uv
      }
    })
  }

  setupRezise(){
    window.addEventListener('resize', this.resize.bind(this))
  }

  resize() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.renderer.setSize(this.width, this.height)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
  }

  addImages(){
    this.material = new THREE.ShaderMaterial({
      uniforms: { 
        time: {value: 0},
        uImage: {value: 0},
        hover: {value: new THREE.Vector2(0.5, 0.5)},
        hoverState: {value: 0}
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide,
    })

    this.materials = []

    this.imageStore = this.images.map(img => {
      let bounds = img.getBoundingClientRect()

      let geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10)
      let texture = new THREE.Texture(img)
      texture.needsUpdate = true
      // let material = new THREE.MeshBasicMaterial({
      //   map: texture
      // })

      let material = this.material.clone()

      img.addEventListener('mouseenter', () => {
        gsap.to(material.uniforms.hoverState, {
          duration: 1,
          value: 1
        })
      })

      img.addEventListener('mouseout', () => {
        gsap.to(material.uniforms.hoverState, {
          duration: 1,
          value: 0
        })
      })

      this.materials.push(material)

      material.uniforms.uImage.value = texture

      let mesh = new THREE.Mesh(geometry, material)
      // mesh.scale.set(bounds.width, bounds.height, 1)

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
      o.mesh.position.y = this.currentScroll -o.top + this.height / 2 - o.height / 2
      o.mesh.position.x = o.left - this.width / 2 + o.width / 2

      o.mesh.scale.set(o.width, o.height, 1)
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

    this.scroll.render()

    this.previousScroll = this.currentScroll
    this.currentScroll = this.scroll.scrollToRender

    if(Math.round(this.currentScroll) !== Math.round(this.previousScroll)) {
      console.log('need render')  
    }

    this.setPosition()

    this.customPass.uniforms.scrollSpeed.value = this.scroll.speedTarget
    this.customPass.uniforms.time.value = this.time

    this.materials.forEach((m) => {
      m.uniforms.time.value = this.time
    })

    this.composer.render()

    // this.renderer.render(this.scene, this.camera)

    window.requestAnimationFrame(this.render.bind(this))
  }
}

new Sketch({
  dom: document.getElementById('canvas')
})