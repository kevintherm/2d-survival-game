import GameObject from "./GameObject.js"
import Projectile from './Projectile.js'
import Triangle from "./Triangle.js"
import { getState } from "../States.js"
import { distanceBetween, outOfScreen } from "../Functions.js"

export default class Player extends GameObject {
    constructor(x, y, width, height, {
        color = 'lightgreen',
        velX = 0,
        velY = 0,
        directionIndicatorSize = 25,
        directionIndicatorLength = 25,
        showDirectionIndicator = false,
        projectileSize = 5,
        projectileSpeed = 6,
        sprite = {
            imageSrc: null,
            framesMax: null,
            framesHold: null,
            paused: null
        },
        audioManager = null,
        destroyWhenKilled = true
    }) {
        super(x, y, width, height, { velX, velY, color, sprite, audioManager, destroyWhenKilled })

        this.showDirectionIndicator = showDirectionIndicator
        this.directionIndicatorSize = directionIndicatorSize
        this.directionIndicatorLength = directionIndicatorLength

        this.directionIndicator = this.showDirectionIndicator ? new Triangle(
            this.x,
            this.y,
            this.directionIndicatorSize,
            this.directionIndicatorLength,
            { color: this.color }
        ) : null


        this.projectileSpeed = projectileSpeed
        this.projectileSize = projectileSize
        this.projectiles = []

        this.ammo = 12
        this.maxAmmo = 12
        this.carriedMagazines = 100
        this.shootDelay = 250
        this.lastShotTime = 0
        this.reloadCooldown = 750
        this.isReloading = false
        this.isAttacking = false
        this.reloadTimeoutId = null
        this.isShooting = false


    }

    update(ctx) {
        this.draw(ctx)
        this.updatePosition()
        this.updateProjectiles(ctx)


        if (this.showDirectionIndicator)
            this.updateDirectionIndicator(ctx)

        if (this.spriteObject)
            this.updateSprite(ctx)

        if (this.isShooting)
            this.shootProjectile()

    }

    updateDirectionIndicator(ctx) {
        this.directionIndicator.update(ctx)
        this.directionIndicator.pointTo(getState().mouse)
        this.directionIndicator.floatAround(this)

        const { distance } = distanceBetween(
            this.center,
            getState().mouse,
        )

        if (distance < this.directionIndicator.floatingRadius * 2) {
            this.directionIndicator.hide()
        } else {
            this.directionIndicator.show()
        }
    }

    updateProjectiles(ctx) {
        for (let i = 0; i < this.projectiles.length; i++) {
            this.projectiles[i].update(ctx)

            if (outOfScreen(this.projectiles[i])) {
                this.projectiles[i].kill()
                this.projectiles.splice(i, 1)
            }
        }
    }

    spawnNewProjectile(velX, velY) {
        return new Projectile(
            this.directionIndicator.x,
            this.directionIndicator.y + 6,
            this.projectileSize,
            {
                color: this.color,
                velX,
                velY
            }
        )
    }

    shootProjectile() {
        const currentTime = performance.now()

        const mousePos = getState().mouse

        if (currentTime - this.lastShotTime >= this.shootDelay) {
            if (this.ammo > 0) {
                const { x, y } = distanceBetween(this.center, mousePos)

                this.projectiles.push(
                    this.spawnNewProjectile(
                        x * this.projectileSpeed,
                        y * this.projectileSpeed
                    )
                )
                this.audioManager.play("shoot", 0.2)

                this.ammo--
                this.lastShotTime = currentTime;
            } else {
                this.reloadAmmo()
            }
        }
    }

    reloadAmmo() {
        this.ammo = 0
        this.isReloading = true
        if (this.reloadTimeoutId) return

        this.audioManager.play("reload", 0.2)

        this.reloadTimeoutId = setTimeout(() => {

            if (this.carriedMagazines !== null) {
                if (this.carriedMagazines > 0) {
                    this.carriedMagazines--
                    this.ammo = this.maxAmmo
                }
            } else
                this.ammo = this.maxAmmo

            this.isReloading = false
            this.reloadTimeoutId = null
        }, this.reloadCooldown)

    }

    shoot() {
        this.isShooting = true
        const timeoutId = setTimeout(() => {
            this.isShooting = false
            clearTimeout(timeoutId)
        }, 2000)
    }

    _killInjectedProperty() {
        this.audioManager = null
        this.spriteObject = null
        this.directionIndicator = null
    }

}