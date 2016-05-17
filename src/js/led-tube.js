import THREE from 'three'

export class LedTube extends THREE.Object3D {
  constructor (mountPointAlpha, mountPointBeta) {
    super()

    this.mountPointAlpha = mountPointAlpha
    this.mountPointBeta = mountPointBeta

    this.RADIUS = 2.5             // 2.5cm radius, 5cm diameter
    this.LENGTH = 100             // 1m length
    this.ALLOW_STRETCH = true     // allow the led tube to stretch beyond its real world size

    this.cylinder = null
    this._on = false

    this.init()
  }

  init () {

    // led tube cylinder
    let geometry = new THREE.CylinderGeometry(this.RADIUS, this.RADIUS, this.LENGTH, 8)
    let material = new THREE.MeshBasicMaterial({color: 0xffffff})
    this.cylinder = new THREE.Mesh(geometry, material)
    this.add(this.cylinder)
  }

  update () {

    // if we are mounted, follow mount points
    if(this.mountPointAlpha && this.mountPointBeta) {

      // get mount point vectors in world space
      let alpha = new THREE.Vector3().setFromMatrixPosition(this.mountPointAlpha.matrixWorld)
      let beta = new THREE.Vector3().setFromMatrixPosition(this.mountPointBeta.matrixWorld)

      // position in center between mount points
      this.center(alpha, beta)
      this.align(alpha, beta)
      this.stretch(alpha, beta)
    }
  }

  center (startVector, endVector) {

    // calculate center vector (add two vectors and divide each component by 2)
    // this is the center in world space!
    let center = new THREE.Vector3()
      .copy(startVector)
      .add(endVector)
      .divideScalar(2)

    // position in center
    this.position.copy(center)

    // reset rotation
    this.rotation.set(0, 0, 0)
    this.updateMatrix()

    // since this object already takes parent transformations into acount
    // we need to inverse the parent matrix world transformations on this child
    this.parent.updateMatrixWorld()
    this.applyMatrix(new THREE.Matrix4().getInverse(this.parent.matrixWorld))
  }

  align (startVector, endVector) {

    // a matrix to fix pivot rotation
    // rotate 90 degs on X
    let offsetRotation = new THREE.Matrix4().makeRotationX(Math.PI / 2)

    // a new orientation matrix to offset pivot
    // look at destination
    // combine orientation with rotation transformations
    let orientation = new THREE.Matrix4()
    orientation.lookAt(startVector, endVector, new THREE.Vector3(0, 1, 0))
    orientation.multiply(offsetRotation)

    // reset first
    this.cylinder.rotation.set(0, 0, 0)
    this.cylinder.updateMatrix()

    // then apply
    this.cylinder.applyMatrix(orientation)
  }

  // scale cylinder to match distance between vectors
  // this might physically break the led tube
  stretch (startVector, endVector) {
    if(!this.ALLOW_STRETCH) return

    let distance = startVector.distanceTo(endVector)
    let scale = distance / this.LENGTH
    this.cylinder.scale.set(scale, scale, scale)
    this.cylinder.updateMatrix()
  }

  set on (value) {
    this._on = value
    this.cylinder.material.color.set(value ? 0xffffff : 0x333333)
  }

  get on () {
    return this._on
  }
}
