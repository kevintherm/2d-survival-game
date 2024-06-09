import GameObject from "./GameObjects/GameObject.js"

/**
 * Place on game loop
 */
export function handle(object, keystroke, options = {}) {
    if (!(object instanceof GameObject))
        throw Error("Handler only accepts instance of GameObject as an argument.")


    if (keystroke.up.isPressed) {
        if (typeof options.fnUp === 'function')
            options.fnUp(object, keystroke)

        if (object.velY > -object.movSpeed) {
            object.velY -= 0.1
        }
    } else if (keystroke.down.isPressed) {
        if (typeof options.fnDown === 'function')
            options.fnDown(object, keystroke)

        if (object.velY < object.movSpeed) {
            object.velY += 0.1
        }
    } else {
        object.velY = 0
    }

    if (keystroke.left.isPressed) {
        if (typeof options.fnLeft === 'function')
            options.fnLeft(object, keystroke)

        if (object.velX > -object.movSpeed) {
            object.velX -= 0.1
        }
    } else if (keystroke.right.isPressed) {
        if (typeof options.fnRight === 'function')
            options.fnRight(object, keystroke)

        if (object.velX < object.movSpeed) {
            object.velX += 0.1
        }
    } else {
        object.velX = 0
    }

    object.velX *= 0.98
    object.velY *= 0.98


}