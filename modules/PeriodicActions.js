import { spawnNewEnemy } from "./Functions.js"

export const FLAGS = {
    spawnEnemies: true,
    enemyChase: true
}

export function runPeriodicFunctions({ player, enemies }) {
    const oustideLoop = () => {
        if (FLAGS.spawnEnemies)
            setInterval(() => {
                enemies.push(spawnNewEnemy())
                enemies.push(spawnNewEnemy())
            }, 2560)
    }

    const insideLoop = () => {
        if (FLAGS.enemyChase) {
            for (let i = 0; i < enemies.length; i++)
                enemies[i].setVelocityTowards(player.center, true)
        }
    }

    return { oustideLoop, insideLoop }
}