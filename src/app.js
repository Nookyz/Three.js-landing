import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

import t1 from '../assets/images/1.jpg'
import t2 from '../assets/images/2.jpg'

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
    // this.geometry = new THREE.PlaneBufferGeometry(1.0, 1.0, 50, 50)
    this.geometry = new THREE.SphereBufferGeometry(0.5, 50, 50)

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

new Sketch({
  dom: document.getElementById('app')
})


{/* <div class="grid">
        <!-- BEGIN item -->
        <a href="https://www.livescience.com/octopuses-punch-fish.html" class="item item_v">
            <div class="item__image">
                <img src="1.jpg" alt="">
                <div class="item__meta">December 23, 2020</div>
            </div>

            <h2 class="item__title">Octopus punches fish in the head (just because it can)</h2>
            <p>Octopuses sometimes partner with fish to hunt, but the partnership comes with risks (for the fish, that is).</p>
        </a>
        <!-- END item -->
        <!-- BEGIN item -->
        <a href="https://www.livescience.com/balloon-like-comb-jelly-discovered-puerto-rico.html" class="item item_h">
            <div class="item__image">
                <img src="2.jpg" alt="">
                <div class="item__meta">December 01, 2020</div>
            </div>

            <h2 class="item__title">Newfound marine blob looks like 'party balloon' with two strings, scientists say</h2>
            <p>This is the first species NOAA scientists have ever discovered from video footage alone.</p>
        </a>
        <!-- END item -->
        <!-- BEGIN item -->
        <a href="https://www.livescience.com/largest-recorded-swarm-of-deep-sea-fish.html" class="item item_h">
            <div class="item__image">
                <img src="4.jpg" alt="">
                <div class="item__meta">November 26, 2020</div>
            </div>

            <h2 class="item__title">Swarm of eels breaks record</h2>
            <p>Before we start mining for precious metals in the darkness of the deep sea, we might try switching on the light first and observing our surroundings.</p>
        </a>
        <!-- END item -->
        <!-- BEGIN item -->
        <a href="https://www.livescience.com/mantis-shrimp-property-wars.html" class="item item_v">
            <div class="item__image">
                <img src="3.jpg" alt="">
                <div class="item__meta">November 03, 2020</div>
            </div>

            <h2 class="item__title">Mantis shrimp punch down</h2>
            <p>Home-stealers fought the hardest for smaller-than-ideal dens.</p>
        </a>
        <!-- END item -->

        <!-- BEGIN item -->
        <a href="https://www.livescience.com/megalodon-big-for-a-shark.html" class="item item_v">
            <div class="item__image">
                <img src="1.jpg" alt="">
                <div class="item__meta">October 05, 2020</div>
            </div>

            <h2 class="item__title">Megalodon's hugeness</h2>
            <p>Even among its extinct relatives, Megalodon was unequalled in length and mass.</p>
        </a>
        <!-- END item -->
        <!-- BEGIN item -->
        <a href="https://www.livescience.com/tiny-sunfish-larva.html" class="item item_h">
            <div class="item__image">
                <img src="2.jpg" alt="">
                <div class="item__meta">July 27, 2020</div>
            </div>

            <h2 class="item__title">Adorable sunfish</h2>
            <p>Sunfish in the Molidae family are among the biggest fish in the world.</p>
        </a>
        <!-- END item -->
        <!-- BEGIN item -->
        <a href="https://www.livescience.com/supergiant-isopod-newfound-species.html" class="item item_h">
            <div class="item__image">
                <img src="4.jpg" alt="">
                <div class="item__meta">August 18, 2020</div>
            </div>

            <h2 class="item__title">Massive 'Darth Vader' sea bug</h2>
            <p>The newly described species is one of the biggest isopods known to science.</p>
        </a>
        <!-- END item -->
        <!-- BEGIN item -->
        <a href="https://www.livescience.com/worlds-deepest-octopus.html" class="item item_v">
            <div class="item__image">
                <img src="3.jpg" alt="">
                <div class="item__meta">June 01, 2020</div>
            </div>

            <h2 class="item__title">Scientists capture the world's deepest octopus</h2>
            <p>The octopus was found miles beneath the ocean surface.</p>
        </a>
        <!-- END item -->
    </div>
    <!-- END grid -->

    <!-- BEGIN footer -->
    <footer class="footer">
        <p>&copy; all news from <a href="https://www.livescience.com/topics/ocean">LiveScience</a></p>
        <p>
            This page was made for <a href="https://www.awwwards.com/academy/course/merging-webgl-and-html-worlds">Merging WebGL and HTML course on Awwwards.com</a>
            <br>Wish you a good day! =)</p>
    </footer>
    <!-- END footer -->
</div> */}