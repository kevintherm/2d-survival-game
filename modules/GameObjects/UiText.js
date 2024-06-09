import GameObject from "./GameObject.js"

export default class UiText extends GameObject {
    constructor(x, y, text, {
        size = 10,
        color = 'white',
        font = 'QuinqueFive',
        destroyAfterMs = 0,
        velY = 0,
    }) {
        super(x, y, null, null, { velY })

        this.text = text
        this.size = size
        this.color = color
        this.font = font

        if (destroyAfterMs > 0)
            setTimeout(() => {
                this.isDead = true
                this.isHidden = true
            }, destroyAfterMs)
    }

    draw(ctx) {
        if (!(ctx instanceof CanvasRenderingContext2D))
            throw Error("Instance of RenderingContext2D is required!")


        ctx.font = `${this.size}px ${this.font}`
        ctx.fillStyle = this.color
        ctx.fillText(this.text, this.x, this.y)
    }

    update(ctx) {
        this.draw(ctx)
        this.updatePosition()
    }


}