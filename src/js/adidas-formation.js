import THREE from 'three'
import _ from 'lodash'

import { TriangleFormation } from './triangle-formation.js'

export class AdidasFormation extends THREE.Object3D {
  constructor () {
    super()

    this.MAX_ROWS = 5

    this._state = null

    this.allTriangles = []        // all triangles
    this.alphaTriangle = null     // just the first (front most)
    this.backwardTriangles = []   // all backward pointing triangles
    this.cornerTriangles = []     // 3 corner triangles
    this.forwardTriangles = []    // all forward pointing triangles

    this.init()
  }

  init () {
    // create adidas setup (triangle of triangles)
    let amount = 1
    for(let row = 0; row < this.MAX_ROWS ; row++) {
      for(let index = 0; index < amount ; index++) {

        let isPointingForward = !(index % 2)
        let isAlphaTriangle = !row && amount === 1
        let isCornerTriangle = isAlphaTriangle || (row === this.MAX_ROWS - 1 && !index) || (row === this.MAX_ROWS - 1 && index === amount - 1)

        // create a triangle (3 led tubes, 3 winches)
        let triangle = new TriangleFormation()
        triangle.position.x = (index * -75) + ((amount - 1) * 75 / 2)
        triangle.position.y = 600
        triangle.position.z = row * -145 + (this.MAX_ROWS * 145 / 2) + (!isPointingForward ? 10 : 0)
        triangle.rotation.y = !isPointingForward ? Math.PI : 0

        // forward/backward triangle
        if (isPointingForward) {
          this.forwardTriangles.push(triangle)
        } else {
          this.backwardTriangles.push(triangle)
        }

        // alpha
        if (isAlphaTriangle) {
          this.alphaTriangle = triangle
        }

        // corner triangle
        if (isCornerTriangle) {
          this.cornerTriangles.push(triangle)
        }

        // add to arrays
        this.allTriangles.push(triangle)

        // add to object
        this.add(triangle)
      }

      amount += 2
    }
  }

  update () {
    _.each(this.allTriangles, (formation) => {
      formation.update()
    })
  }

  set state (value) {
    this._state = value;

    if(value === 'extracted') {
      _.each(this.allTriangles, (formation) => {
        _.each(formation.winches, (winch) => {
          winch.extraction = 1.0
        })
      })
    } else if(value === 'centered') {
      _.each(this.allTriangles, (formation) => {
        _.each(formation.winches, (winch) => {
          winch.extraction = 0.5
        })
      })
    } else if(value === 'sloped') {
      //_.each(this.allTriangles, (formation) => {
        _.each(this.allTriangles[0].winches, (winch) => {
          winch.extraction = 0.5
        })
      //})
    } else if(value === 'state_001') {
      _.each(this.forwardTriangles, (formation) => {
        _.each(formation.winches, (winch) => {
          winch.extraction = 0.25
        })
      })
    } else if(value === 'state_002') {
      _.each(this.backwardTriangles, (formation) => {
        _.each(formation.winches, (winch) => {
          winch.extraction = 0.25
        })
      })
    } else if(value === 'state_003') {
      _.each(this.cornerTriangles, (formation) => {
        _.each(formation.winches, (winch) => {
          winch.extraction = 0.25
        })
      })
    }
  }
}
