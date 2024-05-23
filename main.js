/* eslint "no-unused-vars": "warn" */

import setup, { loadFonts } from "./modules/Setup.js"
import { attachListener } from './modules/Listener.js'
import { clearCanvas, distanceBetween, randNum, rectCircleCollision, rectCollision } from "./modules/Functions.js"
import { getState, state } from "./modules/States.js"
import { handle as handleMovement } from "./modules/MovementHandler.js"
import Player from "./modules/GameObjects/Player.js"
import GameObject from "./modules/GameObjects/GameObject.js"
import Camera from "./modules/camera.js"
import { FLAGS, runPeriodicFunctions } from "./modules/PeriodicActions.js"
import Sprite from "./modules/GameObjects/Sprite.js"

// Game states
let PAUSED = false
let SCORE = 0
let ENEMY_KILLED = 0
let timePassed = 0

const [ctx, { CANVAS_WIDTH }] = setup({
    canvasPadding: 10,
    canvasBackgroundColor: 'rgb(40, 40, 40)',
})

// Set flags
FLAGS.spawnEnemies = false
FLAGS.enemyChase = false

// Local states
const camera = new Camera(ctx)
state.camera = camera


const player = new Player(500, 500, 50, 50, {
    color: 'lightgreen',
    showDirectionIndicator: true,
    showHealthBar: true,
    _uiHealthBarType: 'simple'
})

const enemies = []

const _uiHealth = new Sprite(32, 16, {
    imageSrc: './assets/ui/health.png',
    framesMax: 1,
    scale: 1.5,
    text: 0
})

const _uiAmmo = new Sprite(144, 16, {
    imageSrc: './assets/ui/ammo.png',
    framesMax: 1,
    currentFrame: 0,
    scale: 1.5,
    textSize: 15
})

const _uiScore = new Sprite(CANVAS_WIDTH - 96, 16, {
    imageSrc: './assets/ui/skull.png',
    framesMax: 1,
    currentFrame: 0,
    scale: 1.5,
    textSize: 15,
    text: 0
})

const playerSprite = new Sprite(100, 100, {
    imageSrc: './assets/chara-idle.png',
    framesMax: 4,
    scale: 1.5,
    offset: {
        x: 20,
        y: 30
    },
    framesHold: 14
})

// Main game loop
function main() {
    if (PAUSED) return
    timePassed++
    clearCanvas(ctx)

    // camera.begin()


    if (player.isDead) {
        PAUSED = true

        SCORE = ENEMY_KILLED + Math.floor(timePassed / 100)
        if (confirm("YOU ARE DEAD\nSCORE: " + SCORE)) {
            window.location = "/"
        } else window.location = "https://youtube.com/@kevindrw?sub_confirmation=1"
    }


    // Update objects

    playerSprite.update(ctx)
    playerSprite.animateFrames()
    playerSprite.x = player.x
    playerSprite.y = player.y


    if (player.velX !== 0 || player.velY !== 0) {
        if (!player.isAttacking)
            playerSprite.switchSprite({
                imageSrc: './assets/chara-walk.png',
                framesMax: 8
            })
    } else {
        if (!player.isAttacking)
            playerSprite.switchSprite({
                imageSrc: './assets/chara-idle.png',
                framesMax: 4
            })
    }


    const mouseX = getState().mouse.x
    const mouseY = getState().mouse.y

    let direction;

    if (Math.abs(mouseX - player.x) > Math.abs(mouseY - player.y)) {
        // Horizontal direction is more significant
        if (mouseX > player.x) {
            // direction = 'right';
            // playerSprite.image.src = './assets/chara-walk.png'
            playerSprite.flipX = false
        } else {
            // direction = 'left';
            // playerSprite.image.src = './assets/chara-walk.png'
            playerSprite.flipX = true
        }
    } else {
        // Vertical direction is more significant
        if (mouseY > player.y) {
            // direction = 'down';
            // playerSprite.image.src = './assets/chara-walk.png'
        } else {
            // direction = 'up';
            // playerSprite.image.src = './assets/chara-walk.png'
        }
    }


    player.update(ctx)

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i]

        if (!(enemy instanceof GameObject))
            throw Error("Instance of gameobject required.")

        enemy.update(ctx)


        if (rectCollision(enemy, player)) {
            player.takeDamage(randNum(3, 12))
            enemy.velX = -enemy.velX * 1
            enemy.velY = -enemy.velY * 1
            enemy.takeDamage(randNum(45, 100))
            FLAGS.enemyChase = false
            const timeoutId = setTimeout(() => {
                FLAGS.enemyChase = true
                clearTimeout(timeoutId)
            }, 500)
        }
    }

    handleMovement(player, getState().playerKeystroke)

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i]

        player.projectiles.forEach((proj, iProjectile) => {
            if (rectCircleCollision(enemy, proj)) {
                enemy.takeDamage(randNum(5, 45))

                player.projectiles.splice(iProjectile, 1)

                if (enemy.isDead) {
                    enemies.splice(i, 1)
                    ENEMY_KILLED++
                }

            }
        })
    }

    // camera.moveTo(player.center.x, player.center.y)
    // camera.end()

    // update ui

    _uiHealth.update(ctx)
    _uiHealth.text = player.health

    _uiScore.update(ctx)
    _uiScore.text = String(ENEMY_KILLED)

    _uiAmmo.update(ctx)
    _uiAmmo.text = String(player.ammo)
    if (player.isReloading)
        _uiAmmo.text = "Reloading"


    ctx.strokeStyle = 'orange'
    ctx.strokeRect(0, 0, getState().canvas.width, getState().canvas.height)

    runPeriodicFunctions({ player, enemies }).insideLoop()

    requestAnimationFrame(main)
}

main()

attachListener({
    clickAction(x, y) {
        player.shootProjectile(x, y)
    },
    keyPressAction({ key }) {
        if (key.toLowerCase() === 'r') {
            player.reloadAmmo()
        }

        if (key.toLowerCase() === ' ') {
            player.isAttacking = true
            playerSprite.switchSprite({
                imageSrc: './assets/chara-swing.png',
                framesMax: 8,
                action: 'attack'
            })

            for (let i = 0; i < enemies.length; i++) {
                const { distance } = distanceBetween(player, enemies[i].center)
                if (distance < 200 && playerSprite.currentFrame === 4) {
                    enemies[i].takeDamage(75)

                    if (enemies[i].isDead) {
                        enemies.splice(i, 1)
                        ENEMY_KILLED++
                    }
                }
            }

            player.isAttacking = false
        }
    }
})


runPeriodicFunctions({ player, enemies }).oustideLoop()