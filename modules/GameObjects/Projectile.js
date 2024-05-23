import Arc from "./Arc.js"

export default class Projectile extends Arc {
    constructor(x, y, radius, {
        velX = 0,
        velY = 0,
        color = 'white'
    }) {
        super(x, y, radius, { color, velX, velY })
    }
}