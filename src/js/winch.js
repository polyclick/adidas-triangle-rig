import THREE from 'three'
import TweenMax from 'gsap'
import Sine from 'gsap'
import _ from 'lodash'

import { MountPoint } from './mount-point.js'

export class Winch extends THREE.Object3D {
  constructor (color = 0xffffff, minWireLength = 0, maxWireLength = 1) {
    super()

    this.color = color
    this.minWireLength = minWireLength
    this.maxWireLength = maxWireLength

    this.BOX_HEIGHT = 35
    this.MOTOR_HEIGHT = 20

    this.frame = null
    this.motor = null
    this.wire = null
    this.mountPoint = null

    this.listeners = []

    this.init()
  }

  init () {

    // the metal frame
    let boxGeometry = new THREE.BoxGeometry(20, this.BOX_HEIGHT, 20)
    let boxMaterial = new THREE.MeshBasicMaterial({color: this.color, opacity: 0.75, transparent: true, side: THREE.DoubleSide})
    this.frame = new THREE.Mesh(boxGeometry, boxMaterial)
    this.frame.position.y = this.BOX_HEIGHT / 2
    this.add(this.frame)

    // the motor
    let motorGeometry = new THREE.BoxGeometry(10, this.MOTOR_HEIGHT, 10)
    let motorMaterial = new THREE.MeshBasicMaterial({color: 0xff00ff})
    this.motor = new THREE.Mesh(motorGeometry, motorMaterial)
    this.motor.visible = false
    this.motor.position.y = (this.MOTOR_HEIGHT / 2) + 1
    this.add(this.motor)

    // the wire
    let wireGeometry = new THREE.BoxGeometry(1, 1, 1)
    let wireMaterial = new THREE.MeshBasicMaterial({color: 0x222222})
    this.wire = new THREE.Mesh(wireGeometry, wireMaterial)
    this.add(this.wire)

    // mount point
    this.mountPoint = new MountPoint()
    this.add(this.mountPoint)
  }

  update () {

  }

  on (event, callback) {
    this.listeners.push({
      event: event,
      callback: callback
    })
  }

  set extraction (value) {
    let length = (value * (this.maxWireLength - this.minWireLength)) + this.minWireLength

    TweenMax.to(this.wire.scale, 1, {y: length, ease: Sine.easeInOut})
    TweenMax.to(this.wire.position, 1, {y: -length / 2, ease: Sine.easeInOut})

    TweenMax.to(this.mountPoint.position, 1, {
      y: -length,
      ease: Sine.easeInOut,
      onUpdate: () => {
        _.each(this.listeners, (listener) => {
          if (listener.event === 'mount-point-update' && listener.callback)
            listener.callback(this.mountPoint)
        })
      }
    })
  }
}
