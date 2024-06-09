import { randNum, spawnNewEnemy } from "./Functions.js"

export const FLAGS = {
    spawnEnemies: true,
    enemyChase: true
}

export function runPeriodicFunctions({ player, enemies }) {
    const oustideLoop = () => {
        // if (FLAGS.spawnEnemies) {

        //     setInterval(() => {
        //         const amount = randNum(1, 3)
        //         for (let i = 0; i < amount; i++) {
        //             enemies.push(spawnNewEnemy({ options: { spriteOptions: { shadowBlur: 10 } } }))
        //         }
        //     }, 2345)
        // }
    }

    const insideLoop = () => {
        if (FLAGS.enemyChase) {
            for (let i = 0; i < enemies.length; i++)
                enemies[i].setVelocityTowards(player.center, true)
        }
    }

    return { oustideLoop, insideLoop }
}