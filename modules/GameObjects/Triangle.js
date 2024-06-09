import GameObject from "./GameObject.js"

export default class Triangle extends GameObject {
    constructor(x, y, base, height, {
        color = 'black',
        rotation = 0,
        directionAngle = 0,
        floatingRadius = 60
    }) {
        super(x, y, null, null, { color, directionAngle, floatingRadius })

        this.height = height
        this.base = base
        this.rotation = rotation

    }

    draw(ctx) {
        if (this.isHidden) return

        // Calculate the half base and height
        const halfBase = this.base / 2

        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation * Math.PI / 180)

        // Draw the triangle
        ctx.beginPath()
        ctx.moveTo(0, -this.height / 2) // Top vertex
        ctx.lineTo(-halfBase, this.height / 2) // Bottom left vertex
        ctx.lineTo(halfBase, this.height / 2) // Bottom right vertex
        ctx.closePath()

        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
    }

    update(ctx) {
        this.draw(ctx)
    }

    updateDirection(dx, dy) {
        this.directionAngle = Math.atan2(dy, dx)
        this.directionAngleInDeg = this.directionAngle * (180 / Math.PI)
    }

    pointTo(GameObject) {
        const dx = this.x - GameObject.x
        const dy = this.y - GameObject.y
        this.updateDirection(dx, dy)

        this.rotation = this.directionAngleInDeg + 270 // Magic number adjust accordingly
    }


}