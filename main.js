/* eslint "no-unused-vars": "warn" */

import setup from "./modules/Setup.js"
import { attachListener } from './modules/Listener.js'
import { clearCanvas, distanceBetween, randNum, randPos, rectCircleCollision, rectCollision, spawnNewEnemy } from "./modules/Functions.js"
import { getState, state } from "./modules/States.js"
import { handle as handleMovement } from "./modules/MovementHandler.js"
import Player from "./modules/GameObjects/Player.js"
import GameObject from "./modules/GameObjects/GameObject.js"
import Camera from "./modules/Camera.js"
import { FLAGS, runPeriodicFunctions } from "./modules/PeriodicActions.js"
import Sprite from "./modules/GameObjects/Sprite.js"
import UiText from './modules/GameObjects/UiText.js'

// Game states
let PAUSED = false
let SCORE = 0
let ENEMY_KILLED = 0
let timePassed = 0

const [ctx, { CANVAS_WIDTH, CANVAS_HEIGHT, audio }] = setup({
    canvasPadding: 10,
    canvasBackgroundColor: 'rgb(40, 40, 40)',
})

state.audio = audio

// game flags
FLAGS.spawnEnemies = true
FLAGS.enemyChase = true

// Local states
const camera = new Camera(ctx)
state.camera = camera


const player = new Player(500, 500, 50, 50, {
    color: 'lightgreen',
    showDirectionIndicator: true,
    showHealthBar: true,
    _uiHealthBarType: 'simple',
    sprite: {
        imageSrc: './assets/chara-idle.png',
        framesMax: 2,
        scale: 1.2,
        offset: {
            x: -12,
            y: 5
        },
        shadowBlur: 10
    },
    audioManager: audio
})


const enemies = []

const _uiDisposableText = []

const _uiHealth = new Sprite(32, 16, {
    imageSrc: './assets/ui/health.png',
    framesMax: 1,
    scale: 1.5,
    text: 0,
})

const _uiAmmo = new Sprite(144, 16, {
    imageSrc: './assets/ui/ammo.png',
    framesMax: 1,
    currentFrame: 0,
    scale: 1.5,
    textSize: 15,
})

const _uiScore = new Sprite(CANVAS_WIDTH - 96, 16, {
    imageSrc: './assets/ui/skull.png',
    framesMax: 1,
    currentFrame: 0,
    scale: 1.5,
    textSize: 15,
    text: 0,
})


const pistol = new Sprite(100, 100, {
    imageSrc: './assets/pistol.png',
    framesMax: 1,
    paused: true,
    scale: 1.2,
})

// spawn max enemies: 25
for (let i = 0; i < 1; i++) {
    enemies.push(
        spawnNewEnemy({
            options: {
                destroyWhenKilled: false
            }
        })
    )
}


// Main game loop
function main() {
    if (PAUSED) return
    timePassed++
    clearCanvas(ctx)

    // camera.begin()




    if (player.velX > 0) {
        player.spriteObject.switchSprite({
            imageSrc: './assets/chara-walk.png',
            framesMax: 8
        })
        player.spriteObject.flipX = false
    } else if (player.velX < 0) {
        player.spriteObject.switchSprite({
            imageSrc: './assets/chara-walk.png',
            framesMax: 8
        })
        player.spriteObject.flipX = true
    } else if (player.velX === 0 && player.velY === 0) {
        player.spriteObject.switchSprite({
            imageSrc: './assets/chara-idle.png',
            framesMax: 2,
            framesHold: 35
        })
    }

    if (player.velY !== 0) {
        player.spriteObject.switchSprite({
            imageSrc: './assets/chara-walk.png',
            framesMax: 8
        })

    }




    // Update objects
    updateLocalObjects()


    // player.spriteObject.x = player.x - (player.width / 2 - 7)
    // player.spriteObject.y = player.y - (player.height / 2 + 5)

    // attach pistol to player
    pistol.x = player.directionIndicator.x - (player.directionIndicator.base / 2)
    pistol.y = player.directionIndicator.y - (player.directionIndicator.height / 2) + player.width / 4



    pistol.rotation = player.directionIndicator.rotation - 90

    if (pistol.rotation > 90 && pistol.rotation < 270) {
        pistol.flipY = true
        player.spriteObject.flipX = true
    } else {
        pistol.flipY = false
        player.spriteObject.flipX = false
    }

    player.directionIndicator.floatingRadius = 10

    player.directionIndicator.isHidden = true

    if (pistol.currentFrame === pistol.framesMax - 1) {
        pistol.paused = true
        pistol.currentFrame = 0
    }

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i]

        if (!(enemy instanceof GameObject))
            throw Error("Instance of gameobject required.")

        enemy.update(ctx)



        if (rectCollision(enemy, player)) {

            const damage = randNum(3, 16)
            player.takeDamage(damage)

            const damageText = new UiText(player.x + randNum(-50, 50), player.y + randNum(-50, 50), `-${damage}`, {
                size: 10,
                color: damage >= 12 ? "red" : 'white',
                velY: -1
            })

            _uiDisposableText.push(damageText)

            const destroyText = () => {
                // destroy text after 500ms
                const timeoutId = setTimeout(() => {
                    const index = _uiDisposableText.indexOf(damageText)
                    if (index > -1)
                        _uiDisposableText.splice(index, 1)

                    clearTimeout(timeoutId)
                }, 500)
            }

            destroyText()

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

    handleMovement(player, getState().playerKeystroke, {
        // fnUp: () => {

        // }
    })


    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i]

        player.projectiles.forEach((proj, iProjectile) => {
            if (rectCircleCollision(enemy, proj)) {
                const damage = randNum(25, 64)
                enemy.takeDamage(damage)

                const damageText = new UiText(enemy.x + randNum(-50, 50), enemy.y + randNum(-50, 50), `-${damage}`, {
                    size: 10,
                    color: damage >= 60 ? "red" : 'white',
                    velY: -1
                })

                _uiDisposableText.push(damageText)

                const destroyText = () => {
                    // destroy text after 500ms
                    const timeoutId = setTimeout(() => {
                        const index = _uiDisposableText.indexOf(damageText)
                        if (index > -1)
                            _uiDisposableText.splice(index, 1)

                        clearTimeout(timeoutId)
                    }, 500)
                }
                destroyText()

                player.projectiles.splice(iProjectile, 1)

                if (enemy.isDead) {
                    const { x, y } = randPos(-500, 500, CANVAS_WIDTH, CANVAS_HEIGHT)

                    enemy.hp = 100
                    enemy.x = x
                    enemy.y = y

                    enemy.resetAttr()
                    ENEMY_KILLED++
                }

            }
        })
    }

    // camera.moveTo(player.center.x, player.center.y)
    // camera.end()

    // update ui

    _uiHealth.update(ctx)
    _uiHealth.text = player.hp

    _uiScore.update(ctx)
    _uiScore.text = String(ENEMY_KILLED)

    _uiAmmo.update(ctx)
    _uiAmmo.text = `${String(player.ammo)}/${player.carriedMagazines ?? "∞"}`
    if (player.isReloading)
        _uiAmmo.text = "Reloading"


    ctx.strokeStyle = 'orange'
    ctx.strokeRect(0, 0, getState().canvas.width, getState().canvas.height)

    runPeriodicFunctions({ player, enemies }).insideLoop()

    if (player.isDead) {
        PAUSED = true

        SCORE = ENEMY_KILLED + Math.floor(timePassed / 100)
        // if (confirm("YOU ARE DEAD\nSCORE: " + SCORE)) {
        //     window.location = "/"
        // } else window.location = "https://youtube.com/@kevindrw?sub_confirmation=1"
    }

    requestAnimationFrame(main)
}

function updateLocalObjects() {
    player.update(ctx)
    // player.spriteObject.update(ctx)
    pistol.update(ctx)

    _uiDisposableText.forEach(text => {
        text.update(ctx)
    })
}

main()

attachListener({
    clickAction(x, y) {


        // if (!player.isReloading) pistol.paused = false

    },
    keyPressAction({ key }) {
        if (key.toLowerCase() === 'r' && player.ammo < player.maxAmmo) {
            player.reloadAmmo()
        }

        if (key.toLowerCase() === ' ') {
            player.isAttacking = true

            player.spriteObject.image.src = './assets/chara-swing.png'


            // for (let i = 0; i < enemies.length; i++) {
            //     const { distance } = distanceBetween(player, enemies[i].center)
            //     if (distance < 200) {
            //         enemies[i].takeDamage(75)

            //         if (enemies[i].isDead) {
            //             enemies.splice(i, 1)
            //             ENEMY_KILLED++
            //         }
            //     }
            // }

            // player.isAttacking = false
        }
    }
})

window.onmouseup = () => {
    player.isShooting = false
}

window.onmousedown = () => {
    player.isShooting = true
}


runPeriodicFunctions({ player, enemies }).oustideLoop()
