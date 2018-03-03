const degreesToRadians = (angle) => angle * 0.017453292519
const radiansToDegrees = (angle) => angle * 57.2957795130

class Vector {
  static getVector (angle, length) {
    const radians = degreesToRadians(angle)
    return {
      x: length * Math.sin(radians),
      y: length * Math.cos(radians)
    }
  }

  static getAngle (dx, dy) {
    const angle = radiansToDegrees(Math.atan2(dx, dy))
    return angle > 0 ? angle : angle + 360
  }

  static getLength (dx, dy) {
    return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
  }
}

module.exports = Vector
