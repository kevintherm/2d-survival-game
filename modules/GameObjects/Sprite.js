import { getState } from "../States.js"

/* eslint-disable no-unused-vars */
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
        flipY = false,
        paused = false
    }) {
        this.x = x
        this.y = y
        this.image = new Image()
        this.image.src = imageSrc

        this.defaultFramesHold = framesHold

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
        this.flipY = flipY
        this.brightness = 100

        this.paused = paused

        // if settings shadow blur is true then default value
        // if false then turn off all shadow blur
        // if integer value then set all to the settings value

        if (getState().SHADOWBLUR === false)
            this.shadowBlur = 0
        else if (typeof getState().SHADOWBLUR === 'number')
            this.shadowBlur = getState().SHADOWBLUR
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
        ctx.filter = `brightness(${this.brightness}%)`
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
        if (!this.paused) this.animateFrames()

        this.draw(ctx)
        ctx.shadowBlur = 0
    }

    switchSprite({ imageSrc, framesMax = 8, framesHold = null }) {
        this.image.src = imageSrc
        this.framesMax = framesMax
        this.framesHold = framesHold ? framesHold : this.defaultFramesHold

        if (this.currentFrame > this.framesMax - 1)
            this.currentFrame = 0
    }

    flash() {
        this.brightness = 10000
        const timeoutId = setTimeout(() => {
            this.brightness = 100
            clearTimeout(timeoutId)
        }, 50)
    }
}
