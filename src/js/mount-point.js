import THREE from 'three'

export class MountPoint extends THREE.Object3D {
  constructor () {
    super()

    this.init()
  }

  init () {
    let geometry = new THREE.SphereGeometry(2, 16, 16)
    let material = new THREE.MeshBasicMaterial({color: 0xff0000})
    let mesh = new THREE.Mesh(geometry, material)
    this.add(mesh)
  }
}
