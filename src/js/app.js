import $ from 'jquery'
import _ from 'lodash'
import TweenMax from 'gsap'

// import three and make it global
// so plugins can hook onto the namespace THREE
import THREE from 'three'
window.THREE = THREE

import 'three/cameras/CombinedCamera'

import { AdidasFormation } from './adidas-formation.js'

class App {
  constructor () {
    this.camera = null
    this.clock = null
    this.mesh = null
    this.renderer = null
    this.scene = null

    this.adidasFormation = null

    $(document).ready(() => { this.init() })
  }

  init () {

    // clock
    this.clock = new THREE.Clock()

    // renderer
    this.renderer = new THREE.WebGLRenderer({antialias: true})
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    $('body').append(this.renderer.domElement)

    // orbit camera
    this.camera = new THREE.CombinedCamera(window.innerWidth, window.innerHeight, 70, 1, 5000, -2500, 5000)
    this.camera.position.z = 750     // 7.5m
    this.camera.position.y = 500     // 5m
    this.camera.rotation.x = -Math.PI / 10

    // top camera
    // this.camera = new THREE.CombinedCamera(window.innerWidth, window.innerHeight, 70, 1, 5000, -2500, 5000)
    // this.camera.position.y = 650     // 15m
    // this.camera.toTopView()

    // scene
    this.scene = new THREE.Scene()

    // axis helper
    this.scene.add(new THREE.AxisHelper(50))

    // gird helper
    let gridHelper = new THREE.GridHelper(1500, 100)
    gridHelper.setColors(0x333333, 0x333333)
    this.scene.add(gridHelper)



    // adidas formation
    this.adidasFormation = new AdidasFormation()
    this.scene.add(this.adidasFormation)




    // render & animation ticker
    TweenMax.ticker.fps(60)
    TweenMax.ticker.addEventListener('tick', () => { this.tick() })

    // resize handler, resize once to trigger logic
    $(window).resize(() => { this.resizeHandler() })
    this.resizeHandler()

    $(document).keyup((event) => {
      console.log(event.which)
      if(event.which === 32) {

      }

      if (event.which === 48) {
        this.adidasFormation.state = 'extracted'
      }

      if (event.which === 49) {
        this.adidasFormation.state = 'centered'
      }

      if (event.which === 50) {
        this.adidasFormation.state = 'state_001'
      }

      if (event.which === 51) {
        this.adidasFormation.state = 'state_002'
      }

      if (event.which === 52) {
        this.adidasFormation.state = 'state_003'
      }

      if (event.which === 53) {
        this.adidasFormation.state = 'state_004'
      }

      if (event.which === 54) {

      }

      if (event.which === 55) {

      }

      if (event.which === 56) {

      }

      if (event.which === 57) {

      }

    })
  }

  tick () {
    this.update()
    this.render()
  }

  update () {

    // update formation
    this.adidasFormation.update()

    // camera
    this.camera.position.x = Math.sin(this.clock.getElapsedTime() / 10) * 750
    this.camera.position.z = Math.cos(this.clock.getElapsedTime() / 10) * 750
    this.camera.lookAt(new THREE.Vector3(0, 250, 0))
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }

  resizeHandler () {

    // update camera
    this.camera.setSize(window.innerWidth, window.innerHeight)
    this.camera.updateProjectionMatrix()

    // update renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

// export an already created instance
export let app = new App()
