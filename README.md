# 🎒 School Survival Game

A fun 2D side-scrolling game where you play as a middle school student trying to dodge flying objects in the school hallway!

## 🎮 How to Play

### Objective
Survive as long as possible by dodging flying school objects thrown by mischievous classmates.

### Controls
- **← → or A D** - Move left/right
- **Spacebar or ↑** - Jump
- **↓ or S** - Crouch
- **P** - Pause/Resume game
- **R** - Restart game (when game over)
- **M** - Toggle sound (future feature)

### Gameplay Features
- **3 Lives** - You start with 3 hearts, lose one when hit
- **Progressive Difficulty** - Game gets faster and more challenging over time
- **Multiple Obstacles** - Different school objects with unique behaviors:
  - ✈️ **Paper Airplanes** - Fast and small
  - 📚 **Textbooks** - Medium speed, bouncy
  - 🍎 **Apples** - Slow but unpredictable
  - ✏️ **Pencils** - Very fast projectiles
  - 🎒 **Backpacks** - Heavy and slow
  - 🍽️ **Lunch Trays** - Medium speed, large hitbox

### Scoring
- **Survival Time** - 1 point per 100ms survived
- **Dodging Bonus** - 10 points per object dodged
- **High Score** - Automatically saved locally

## 🚀 How to Run

1. **Open the game**:
   - Simply open `index.html` in your web browser
   - No installation required!

2. **Start playing**:
   - Click "Start Game" on the main screen
   - Use keyboard controls to move and jump
   - Try to survive as long as possible!

## 🛠️ Technical Details

### Built With
- **HTML5 Canvas** - For game rendering
- **JavaScript (ES6+)** - Game logic and mechanics
- **CSS3** - Styling and animations
- **Pixel Art Style** - Retro 8-bit aesthetic

### Game Architecture
- **Modular Design** - Separate classes for different game components
- **Object-Oriented** - Clean, maintainable code structure
- **Performance Optimized** - Efficient collision detection and rendering

### File Structure
```
school-survival-game/
├── index.html              # Main game page
├── css/
│   └── style.css           # Game styling and animations
├── js/
│   ├── game.js             # Main game engine
│   ├── player.js           # Player character logic
│   ├── obstacles.js        # Flying objects system
│   ├── collision.js        # Collision detection utilities
│   └── ui.js               # User interface management
├── assets/                 # Future: sprites, sounds, backgrounds
└── README.md              # This file
```

## 🎯 Game Features

### Current Features
- ✅ Smooth player movement and jumping
- ✅ Multiple obstacle types with unique behaviors
- ✅ Progressive difficulty scaling
- ✅ Collision detection system
- ✅ Score tracking and high score saving
- ✅ Pause/resume functionality
- ✅ Beautiful pixel art graphics
- ✅ Responsive UI with animations

### Future Enhancements
- 🔄 Sound effects and background music
- 🔄 Particle effects for impacts
- 🔄 More obstacle types
- 🔄 Power-ups system
- 🔄 Multiple levels/backgrounds
- 🔄 Mobile touch controls
- 🔄 Multiplayer mode

## 🎨 Art Style

The game features a retro pixel art aesthetic with:
- **Bright, school-themed colors**
- **Simple geometric shapes**
- **Smooth animations**
- **Classic 8-bit feel**

## 🏆 Tips for High Scores

1. **Stay Mobile** - Keep moving to avoid getting cornered
2. **Use Jumping** - Jump over low-flying objects
3. **Crouch When Needed** - Duck under high-flying projectiles
4. **Watch Patterns** - Learn the spawn patterns of different objects
5. **Stay Calm** - Don't panic when the game speeds up!

## 🐛 Known Issues

- Collision detection is basic AABB (Axis-Aligned Bounding Box)
- No sound effects yet (planned for future update)
- Performance may degrade with very high scores (1000+ objects)

## 🤝 Contributing

This is a learning project! Feel free to:
- Report bugs or issues
- Suggest new features
- Improve the code
- Add new obstacle types
- Enhance the graphics

## 📝 License

This project is open source and available under the MIT License.

---

**Have fun surviving the school hallway! 🎒✨**

