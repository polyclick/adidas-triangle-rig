import THREE from 'three'
import _ from 'lodash'

import { LedTube } from './led-tube.js'
import { Winch } from './winch.js'

export class TriangleFormation extends THREE.Object3D {
  constructor () {
    super()

    // circumcircle radius of the triangle
    // check: https://rechneronline.de/pi/equilateral-triangle.php
    // +- 57 radius will result in led tubes of about 1 meter (100 cm)
    this.RADIUS = 57

    this.ledTubes = []
    this.winches = []

    this.init()
    this.update()
  }

  init () {
    let alphaWinch = new Winch(0x444444, 10, 500)
    alphaWinch.position.x = -1 * this.RADIUS
    alphaWinch.position.z = -1 * this.RADIUS
    this.winches.push(alphaWinch)
    this.add(alphaWinch)

    let betaWinch = new Winch(0x444444, 10, 500)
    betaWinch.position.x = 1 * this.RADIUS
    betaWinch.position.z = -1 * this.RADIUS
    this.winches.push(betaWinch)
    this.add(betaWinch)

    let gammaWinch = new Winch(0x444444, 10, 500)
    gammaWinch.position.x = 0 * this.RADIUS
    gammaWinch.position.z = 1 * this.RADIUS
    this.winches.push(gammaWinch)
    this.add(gammaWinch)

    let ledTube01 = new LedTube(alphaWinch.mountPoint, betaWinch.mountPoint)
    this.ledTubes.push(ledTube01)
    this.add(ledTube01)

    let ledTube02 = new LedTube(betaWinch.mountPoint, gammaWinch.mountPoint)
    this.ledTubes.push(ledTube02)
    this.add(ledTube02)

    let ledTube03 = new LedTube(gammaWinch.mountPoint, alphaWinch.mountPoint)
    this.ledTubes.push(ledTube03)
    this.add(ledTube03)

    // setInterval(() => {
    //   ledTube01.on = !ledTube01.on
    // }, 200)

    // setInterval(() => {
    //   ledTube02.on = !ledTube02.on
    // }, 100)

    // setInterval(() => {
    //   ledTube03.on = !ledTube03.on
    // }, 128)

    alphaWinch.extraction = 1.0
    betaWinch.extraction = 1.0
    gammaWinch.extraction = 1.0
    setInterval(() => {
      // let extr = Math.random() // 0 to 1, respects min and max lengths
      // alphaWinch.extraction = extr
      // betaWinch.extraction = Math.min(Math.max(extr + ((Math.random() * 0.2) - 0.1), 0), 1)  // 0 to 1, respects min and max lengths
      // gammaWinch.extraction = Math.min(Math.max(extr + ((Math.random() * 0.2) - 0.1), 0), 1)  // 0 to 1, respects min and max lengths
    }, 2000)
  }

  update() {
    _.each(this.winches, (winch) => {
      winch.update()
    })

    _.each(this.ledTubes, (ledTube) => {
      ledTube.update()
    })
  }
}
