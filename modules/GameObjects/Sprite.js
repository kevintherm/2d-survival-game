export default class Sprite {
    constructor(x, y, {
        imageSrc,
        currentFrame = 0,
        framesMax = 8,
        offset = { x: 0, y: 0 },
        scale = 1,
        text = null,
        textPos = 'right',
        textSize = 15,
        framesHold = 15,
        shadowBlur = 0,
        rotation = 0,
        flipX = false,
        flipY = false
    }) {
        this.x = x
        this.y = y
        this.image = new Image()
        this.image.src = imageSrc

        this.text = text
        this.textPos = textPos
        this.textSize = textSize
        this.currentFrame = currentFrame
        this.framesMax = framesMax
        this.offset = offset
        this.scale = scale
        this.framesElapsed = 0
        this.framesHold = framesHold
        this.shadowBlur = shadowBlur
        this.rotation = rotation
        this.flipX = flipX
        this.fipY = flipY
    }

    draw(ctx) {
        if (!(ctx instanceof CanvasRenderingContext2D))
            throw Error("Instance of CanvasRenderingContext2D required.")

        if (this.shadowBlur) {
            ctx.shadowColor = "white"
            ctx.shadowBlur = this.shadowBlur
        }

        ctx.save();

        // Move the origin to the center of the image (considering the current position and the offset)
        const centerX = this.x - this.offset.x + (this.image.width / this.framesMax) * this.scale / 2;
        const centerY = this.y - this.offset.y + this.image.height * this.scale / 2;

        ctx.translate(centerX, centerY);  // Move the canvas origin to the center of the image
        ctx.rotate(this.rotation * Math.PI / 180);

        // Apply flipping based on this.flipX and this.flipY
        const scaleX = this.flipX ? -1 : 1;
        const scaleY = this.flipY ? -1 : 1;
        ctx.scale(scaleX, scaleY);

        // Draw the image with the new origin
        ctx.drawImage(
            this.image,
            this.currentFrame * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            -((this.image.width / this.framesMax) * this.scale) / 2,
            -(this.image.height * this.scale) / 2,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );

        ctx.restore();

        if (!this.text) return

        const align = this.textPos === 'right' ? 1 : -1

        ctx.font = `${this.textSize}px QuinqueFive`
        ctx.fillStyle = "white"
        ctx.fillText(this.text, this.x + this.image.width * align + this.textSize, this.y + this.textSize)



    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            this.currentFrame++
            if (this.currentFrame > this.framesMax - 1) {
                this.currentFrame = 0
            }
        }
    }

    update(ctx) {
        this.draw(ctx)
        ctx.shadowBlur = 0
    }

    switchSprite({ imageSrc, framesMax = 8, action = null }) {
        if (this.currentFrame > framesMax) {
            this.currentFrame = 0
        }

        this.image.src = imageSrc
        this.framesMax = framesMax
    }
}
