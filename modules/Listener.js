import { getState, state } from "./States.js"


export function attachListener(actions = {}) {
    const { clickAction } = actions
    const { keyPressAction } = actions

    if (typeof clickAction !== 'function')
        throw Error("clickAction must be a callable.")

    if (typeof keyPressAction !== 'function')
        throw Error("clickAction must be a callable.")

    addEventListener('mousemove', (e) => {
        const rect = getState().canvas.dom.getBoundingClientRect()
        // const { x, y } = getState().camera.screenToWorld(
        // e.clientX - rect.top,
        // e.clientY - rect.left
        // )
        const x = e.clientX - rect.top,
            y = e.clientY - rect.left
        state.mouse.x = x
        state.mouse.y = y
    })

    addEventListener('keydown', ({ key }) => {
        switch (key.toLowerCase()) {
            case 'w':
                state.playerKeystroke.up.isPressed = true
                break

            case 's':
                state.playerKeystroke.down.isPressed = true
                break

            case 'a':
                state.playerKeystroke.left.isPressed = true
                break

            case 'd':
                state.playerKeystroke.right.isPressed = true
                break

        }
    })

    addEventListener('keyup', ({ key }) => {
        switch (key.toLowerCase()) {
            case 'w':
                state.playerKeystroke.up.isPressed = false
                break

            case 's':
                state.playerKeystroke.down.isPressed = false
                break

            case 'a':
                state.playerKeystroke.left.isPressed = false
                break

            case 'd':
                state.playerKeystroke.right.isPressed = false
                break

        }
    })

    addEventListener('click', () => {
        const { x, y } = getState().mouse
        clickAction(x, y)
    })

    addEventListener('keypress', keyPressAction)

    addEventListener('blur', () => {
        if (!document.hasFocus()) {
            for (const keystroke in state.playerKeystroke) {
                state.playerKeystroke[keystroke].isPressed = false
            }
        } else console.log('else')
    })
}