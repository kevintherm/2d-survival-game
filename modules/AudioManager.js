export default class AudioManager {
    constructor() {
        this.audioCache = {};
    }

    preload(files) {
        for (const [key, src] of Object.entries(files)) {
            const audio = new Audio(src);
            this.audioCache[key] = audio;
        }
    }

    play(key, volume = 1.0) {
        if (this.audioCache[key]) {
            const audio = this.audioCache[key].cloneNode(); // Clone the preloaded audio object
            audio.volume = volume;
            audio.play();
        } else {
            console.warn(`Audio key "${key}" not found in cache.`);
        }
    }
}