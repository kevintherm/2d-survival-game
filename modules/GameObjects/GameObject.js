import { distanceBetween, randNum } from '../Functions.js'
import { getState } from '../States.js'
import Sprite from './Sprite.js'
import AudioManager from '../AudioManager.js'

export default class GameObject {
    constructor(x, y, width, height, {
        velX = 0,
        velY = 0,
        color = 'black',
        _objectShape = 'Rect',
        health = 100,
        directionAngle = 0,
        floatingRadius = 60,
        sprite = {
            imageSrc: null,
            framesMax: null,
            framesHold: null,
            paused: null
        },
        audioManager = null
    }) {
        this.x = x
        this.y = y
        this.velX = velX
        this.velY = velY
        this.movSpeed = 2
        this.width = width
        this.height = height
        this.center = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
        this.color = color
        this.originalColor = color
        this.isHidden = false

        // Special props
        Object.defineProperty(this, 'shape', {
            value: _objectShape,
            writable: false,
            enumerable: true
        })

        this.hp = health
        this.maxHealth = 100
        this.isDead = false

        this.directionAngle = directionAngle
        this.directionAngleInDeg = null
        this.floatingRadius = floatingRadius

        this.spriteObject = null
        if (sprite && sprite.imageSrc) {
            this.spriteObject = new Sprite(
                this.x,
                this.y,
                {
                    imageSrc: sprite.imageSrc,
                    ...sprite
                }
            )
        }

        if (audioManager && !(audioManager instanceof AudioManager))
            throw new Error("Invalid instance of AudioManager.")

        this.audioManager = audioManager
    }


    draw(ctx) {
        if (this.isHidden) return

        if (!(ctx instanceof CanvasRenderingContext2D))
            throw Error("Instance of RenderingContext2D is required!")

        if (getState().DEBUG) {
            ctx.strokeStyle = this.color
            ctx.lineWidth = 1
            ctx.strokeRect(
                this.x,
                this.y,
                this.width,
                this.height
            )
        }
    }

    update(ctx) {
        this.draw(ctx)
        this.updateSprite(ctx)
        this.updatePosition()
    }

    updatePosition() {
        this.x += this.velX
        this.y += this.velY

        this.center = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        }
    }

    hide() {
        this.isHidden = true
    }

    show() {
        this.isHidden = false
    }

    flash() {
        this.color = 'white'
        const timeoutId = setTimeout(() => {
            this.color = this.originalColor
            clearTimeout(timeoutId)
        }, 100)
    }

    takeDamage(damage = 0) {



        this.hp -= damage
        this.flash()
        if (this.spriteObject)
            this.spriteObject.flash()


        if (this.hp <= 0) {
            this.kill()
            if (this.audioManager)
                this.audioManager.play("die", 0.5)
        }
    }

    setVelocityTowards(target, randomVelocity = false) {
        const { x, y } = distanceBetween(this, target)
        if (randomVelocity) {
            this.velX = x * randNum(this.movSpeed * 0.2, this.movSpeed * 1.2)
            this.velY = y * randNum(this.movSpeed * 0.2, this.movSpeed * 1.2)
        } else {
            this.velX = x * this.movSpeed * 0.8
            this.velY = y * this.movSpeed * 0.8
        }
    }

    floatAround(object) {
        this.directionAngle += 0.01

        if (!(object instanceof GameObject))
            throw Error("Instance of GameObject is required")

        this.x = object.center.x + this.floatingRadius * -Math.cos(this.directionAngle)
        this.y = object.center.y + this.floatingRadius * -Math.sin(this.directionAngle)
    }

    updateSprite(ctx) {
        this.spriteObject.update(ctx)
        this.spriteObject.x = this.x - (this.width / 2)
        this.spriteObject.y = this.y - (this.height / 2 - 10)
    }

    kill() {
        this.hp = 0
        this.isDead = true
        this.isHidden = true
        this.x = -100
        this.y = -100
        this.velX = 0
        this.velY = 0

    }

    _killInjectedProperty() {
        this.audioManager = null
        this.spriteObject = null
    }
}