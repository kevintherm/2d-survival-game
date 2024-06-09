import GameObject from "./GameObjects/GameObject.js"
import Player from "./GameObjects/Player.js"
import { getState } from "./States.js"

const world = getState().worldBorder
const canvas = getState().canvas

export function randNum(min, max, round = true) {
    const number = Math.random() * (max - min + 1) + min
    return round ? Math.floor(number) : number
}

export function clearCanvas(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

export function distanceBetween(object1, object2) {
    const dx = object2.x - object1.x
    const dy = object2.y - object1.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return { x: dx / distance, y: dy / distance, distance }
}

export function outOfScreen(object) {
    if (!(object instanceof GameObject))
        return (object.x < 0 ||
            object.x > world.width ||
            object.y < 0 ||
            object.y > world.height)

    if (object.shape === 'Rect')
        return (object.x + object.width < 0 ||
            object.x > world.width ||
            object.y + object.height < 0 ||
            object.y > world.height)

    if (object.shape === 'Arc')
        return (object.x + (object.radius) < 0 ||
            object.x - object.radius > world.width ||
            object.y + (object.radius) < 0 ||
            object.y - object.radius > world.height)

    return Error("Unknown object position.")
}

export function spawnNewEnemy(args = { x: null, y: null, size: null, options: { spawnZone: null, spriteOptions: {} } }) {
    const sizeValue = 50;
    let xPos, yPos;

    if (args.x && args.y && args.x !== null && args.y !== null) {
        xPos = args.x;
        yPos = args.y;
    } else {
        const { spawnZone } = args.options;
        if (spawnZone && spawnZone.length > 0) { // Check if spawnZone is defined and not empty
            const spawnZoneIndex = randNum(0, spawnZone.length - 1);
            const zone = spawnZone[spawnZoneIndex];
            xPos = randNum(zone[0][0], zone[1][0] - sizeValue);
            yPos = randNum(zone[0][1], zone[1][1] - sizeValue);
        } else {
            xPos = randNum(0, canvas.width - sizeValue);
            yPos = randNum(0, canvas.height - sizeValue);
        }
    }

    return new Player(xPos, yPos, sizeValue, sizeValue, {
        color: 'red',
        sprite: {
            imageSrc: './assets/slime-idle.png',
            framesMax: 6,
            scale: 1.5,
            offset: {
                x: 48,
                y: 78
            },
            ...args?.options?.spriteOptions
        },
        audioManager: getState().audio
        , ...args.options
    })
}

/**
 * Checks for collision between a rectangle and an arc (circle).
 * @param {Object} rect - The rectangle object with x, y, width, and height properties.
 * @param {Object} circle - The circle object with x, y (center coordinates), and radius properties.
 * @returns {boolean} - True if there is a collision, false otherwise.
 */
export function rectCircleCollision(rect, circle) {
    // Find the closest point to the circle within the rectangle
    let closestX = clamp(circle.x, rect.x, rect.x + rect.width);
    let closestY = clamp(circle.y, rect.y, rect.y + rect.height);

    // Calculate the distance between the circle's center and this closest point
    let distanceX = circle.x - closestX;
    let distanceY = circle.y - closestY;

    // Calculate the distance
    let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // If the distance is less than the circle's radius, there is a collision
    return distance <= circle.radius;
}

/**
 * Clamps a value between a minimum and a maximum value.
 * @param {number} value - The value to clamp.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - The clamped value.
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function rectCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

export function randPos(minRange, maxRange, width, height) {
    const posX = Math.random() < 0.5 ? randNum(minRange, 0) : randNum(width, width + maxRange);
    const posY = Math.random() < 0.5 ? randNum(minRange, 0) : randNum(height, height + maxRange);
    return { x: posX, y: posY };
}