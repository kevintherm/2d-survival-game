# 2D Survival Game Project

## Project Overview

This project is a 2D survival game built completely from scratch. The game features custom sprite handling and a bespoke 2D physics system, providing a unique gameplay experience. Players must navigate through the game world, manage their resources, and survive against various challenges.

## Features

- **Custom Sprite System:** All game sprites are managed using a custom-built sprite system, allowing for detailed control over character and object animations.
- **2D Physics Engine:** The game includes a hand-crafted 2D physics engine to handle movement, collisions, and other physics-based interactions.
- **Resource Management:** Players need to manage health and ammunition, represented by various UI elements.

## File Structure

### Assets

- **fonts:** Contains font files for in-game text.
- **sfx:** Stores sound effects used in the game.
- **ui:** Contains user interface elements such as health bars and icons.
  - `ammo.png`
  - `health-bar.png`
  - `health.png`
  - `skull.png`
- **Characters and Objects:** Sprite sheets and images for characters and items.
  - `chara-idle.png`
  - `chara-swing.png`
  - `chara-walk.png`
  - `pistol.png`
  - `slime-idle.png`

### Modules

- **GameObjects:** Contains classes for game objects and their behaviors.
  - `Arc.js`
  - `GameObject.js`
  - `Player.js`
  - `Projectile.js`
  - `Sprite.js`
  - `Triangle.js`
  - `UiText.js`
- **Core Modules:** Essential game functionality and management.
  - `AudioManager.js`: Manages game audio.
  - `Camera.js`: Handles camera movements and views.
  - `Functions.js`: Utility functions used throughout the game.
  - `Listener.js`: Manages event listeners.
  - `MovementHandler.js`: Handles player and object movements.
  - `PeriodicActions.js`: Manages actions that occur periodically.
  - `Setup.js`: Initializes and sets up the game environment.
  - `States.js`: Manages the different states of the game.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository to your local machine.
2. Ensure you have the necessary development environment set up (e.g., Node.js, any required libraries).
3. Navigate to the project directory and run the setup script (`Setup.js`) to initialize the game environment.
4. Start the game by executing the main script (typically found in `Setup.js` or a designated entry point).

## Future Enhancements

Planned features and improvements include:

- Adding more character animations and interactions.
- Enhancing the physics engine for more complex interactions.
- Implementing new gameplay mechanics and challenges.
- Expanding the game world with new environments and obstacles.

## Contribution

If you are interested in contributing to the project, please fork the repository and submit a pull request with your changes. Ensure your code follows the project's coding standards and includes appropriate documentation.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## Contact

For questions or suggestions, please open an issue on the project's GitHub page or contact the project maintainer directly.

---

Happy coding and enjoy the game!
