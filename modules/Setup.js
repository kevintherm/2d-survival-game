import { getState, state } from "./States.js"

export default function setup({
    canvasPadding = 10,
    canvasBackgroundColor,
    canvasBorderColor = 'white'
}) {

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    loadFonts([
        {
            name: 'QuinqueFive',
            path: './assets/fonts/QuinqueFive.otf'
        }
    ])

    canvas.style.cursor = 'crosshair'

    const worldBorder = {
        x: 0,
        y: 0,
        width: 2000,
        height: 2000
    }
    state.worldBorder = worldBorder

    state.canvas.dom = canvas
    document.body.appendChild(canvas)

    if (canvasBackgroundColor)
        canvas.style.backgroundColor = canvasBackgroundColor

    if (canvasBorderColor)
        canvas.style.border = `solid 1px ${canvasBorderColor}`

    const CANVAS_WIDTH = canvas.width = innerWidth - canvasPadding
    const CANVAS_HEIGHT = canvas.height = innerHeight - canvasPadding

    state.canvas.width = CANVAS_WIDTH
    state.canvas.height = CANVAS_HEIGHT

    return [ctx, { CANVAS_WIDTH, CANVAS_HEIGHT, dom: canvas }]
}

export function loadFonts(fonts = []) {
    for (const font of fonts) {
        const newFont = new FontFace(font.name, `url(${font.path})`);
        newFont.load().then((font) => {

            document.fonts.add(newFont)
            if (getState().DEBUG)
                console.log(`${font.family} loaded.`)
        })
            .catch(error => console.error("Error loading font: ", error))
    }
}