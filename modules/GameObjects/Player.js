import GameObject from "./GameObject.js"
import Triangle from "./Triangle.js"
import Projectile from './Projectile.js'
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
        projectileSize = 10,
        projectileSpeed = 5,
    }) {
        super(x, y, width, height, { velX, velY, color })

        this.showDirectionIndicator = showDirectionIndicator
        this.directionIndicatorSize = directionIndicatorSize
        this.directionIndicatorLength = directionIndicatorLength

        this.directionIndicator = new Triangle(
            this.x,
            this.y,
            this.directionIndicatorSize,
            this.directionIndicatorLength,
            { color: this.color }
        )


        this.projectileSpeed = projectileSpeed
        this.projectileSize = projectileSize
        this.projectiles = []

        this.ammo = 12
        this.maxAmmo = 12
        this.lastShootTime = 0
        this.reloadCooldown = 750
        this.reloadTimeoutId = null
        this.isReloading = false
        this.isAttacking = false


    }

    update(ctx) {
        this.draw(ctx)
        this.updatePosition()
        this.updateProjectiles(ctx)
        if (this.showDirectionIndicator)
            this.updateDirectionIndicator(ctx)

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
                this.projectiles.splice(i, 1)
            }
        }
    }

    spawnNewProjectile(velX, velY) {
        return new Projectile(
            this.center.x,
            this.center.y,
            this.projectileSize,
            {
                color: this.color,
                velX,
                velY
            }
        )
    }

    shootProjectile(mouseX, mouseY) {
        const currentTime = performance.now()

        if (this.ammo > 0) {
            const { x, y } = distanceBetween(this.center, { x: mouseX, y: mouseY })

            this.projectiles.push(
                this.spawnNewProjectile(
                    x * this.projectileSpeed,
                    y * this.projectileSpeed
                )
            )

            this.ammo--
            this.lastShootTime = currentTime

            // console.log(`Shot fired! Ammo left: ${this.ammo}`)
        } else {
            this.reloadAmmo()
        }
    }

    reloadAmmo() {
        this.ammo = 0
        this.isReloading = true
        if (this.reloadTimeoutId) return

        this.reloadTimeoutId = setTimeout(() => {
            this.ammo = this.maxAmmo
            this.isReloading = false
            this.reloadTimeoutId = null
        }, this.reloadCooldown)

    }

}