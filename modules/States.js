// States.js
export const state = {
    camera: null,
    canvas: {},
    playerKeystroke: {
        left: { isPressed: false },
        right: { isPressed: false },
        up: { isPressed: false },
        down: { isPressed: false },
    },
    mouse: { x: 0, y: 0 },
    mouseClick: false,
    worldBorder: {},
    DEBUG: true,
    SHADOWBLUR: true,
    audio: null
}

export function getState() {
    return state
}