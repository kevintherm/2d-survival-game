import GameObject from "./GameObjects/GameObject.js"

/**
 * Place on game loop
 */
export function handle(object, keystroke) {
    if (!(object instanceof GameObject))
        throw Error("Handler only accepts instance of GameObject as an argument.")

    if (keystroke.up.isPressed) {
        if (object.velY > -object.movSpeed) {
            object.velY -= 0.1
        }
    } else if (keystroke.down.isPressed) {
        if (object.velY < object.movSpeed) {
            object.velY += 0.1
        }
    } else {
        object.velY = 0
    }

    if (keystroke.left.isPressed) {
        if (object.velX > -object.movSpeed) {
            object.velX -= 0.1
        }
    } else if (keystroke.right.isPressed) {
        if (object.velX < object.movSpeed) {
            object.velX += 0.1
        }
    } else {
        object.velX = 0
    }

    object.velX *= 0.98
    object.velY *= 0.98


}