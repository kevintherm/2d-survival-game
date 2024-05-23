import GameObject from "./GameObject.js"

export default class Arc extends GameObject {
    constructor(x, y, radius, {
        velX = 0,
        velY = 0,
        startAngle = 0,
        endAngle = Math.PI * 2,
        color = 'white'
    }) {
        super(x, y, radius, radius, { color, velX, velY, _objectShape: 'Arc' })

        this.radius = radius
        this.startAngle = startAngle
        this.endAngle = endAngle
    }

    draw(ctx) {
        if (this.isHidden) return

        if (!(ctx instanceof CanvasRenderingContext2D))
            throw Error("Instance of RenderingContext2D is required!")

        ctx.beginPath()
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            this.startAngle,
            this.endAngle
        )
        ctx.strokeStyle = this.color
        ctx.stroke()
    }

    update(ctx) {
        this.draw(ctx)
        this.updatePosition()
    }
}