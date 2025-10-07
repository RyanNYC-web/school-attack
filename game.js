// Main Game Engine
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Game state
        this.gameState = 'start'; // 'start', 'playing', 'paused', 'gameOver'
        this.score = 0;
        this.highScore = localStorage.getItem('schoolSurvivalHighScore') || 0;
        this.gameTime = 0;
        this.difficulty = 1;
        
        // Game objects
        this.player = null;
        this.obstacles = [];
        this.background = null;
        this.platforms = [];
        
        // Timing
        this.lastTime = 0;
        this.obstacleSpawnTimer = 0;
        this.obstacleSpawnInterval = 2000; // Start with 2 seconds between spawns
        this.platformSpawnTimer = 0;
        this.platformSpawnInterval = 8000; // Start with 8 seconds between platform spawns
        
        // Input handling
        this.keys = {};
        this.setupEventListeners();
        
        // Initialize game
        this.init();
    }
    
    init() {
        this.player = new Player(this.width, this.height);
        this.background = new Background(this.width, this.height);
        this.createPlatforms();
        this.updateUI();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Game control keys
            if (e.code === 'KeyP') {
                if (this.gameState === 'playing') {
                    this.togglePause();
                } else if (this.gameState === 'paused') {
                    this.togglePause();
                }
            }
            if (e.code === 'KeyR' && this.gameState === 'gameOver') {
                this.restart();
            }
            
            // Prevent default for game keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // UI button events
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('startScreen').classList.add('hidden');
        this.resetGame();
    }
    
    restart() {
        this.gameState = 'playing';
        document.getElementById('gameOverScreen').classList.add('hidden');
        this.resetGame();
    }
    
    resetGame() {
        this.score = 0;
        this.gameTime = 0;
        this.difficulty = 1;
        this.obstacles = [];
        this.platforms = [];
        this.obstacleSpawnTimer = 0;
        this.obstacleSpawnInterval = 2000;
        this.platformSpawnTimer = 0;
        this.platformSpawnInterval = 8000;
        this.player.reset();
        this.createPlatforms();
        this.updateUI();
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('schoolSurvivalHighScore', this.highScore);
        }
        
        // Show game over screen
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
        document.getElementById('gameOverScreen').classList.remove('hidden');
    }
    
    update(deltaTime) {
        if (this.gameState !== 'playing') return;
        
        this.gameTime += deltaTime;
        
        // Update difficulty (increase speed and spawn rate over time)
        this.difficulty = 1 + (this.gameTime / 10000); // Increase difficulty every 10 seconds
        this.obstacleSpawnInterval = Math.max(500, 2000 - (this.gameTime / 100)); // Faster spawning
        
        // Update player
        this.player.update(deltaTime, this.keys);
        
        // Spawn obstacles
        this.obstacleSpawnTimer += deltaTime;
        if (this.obstacleSpawnTimer >= this.obstacleSpawnInterval) {
            this.spawnObstacle();
            this.obstacleSpawnTimer = 0;
        }
        
        // Spawn platforms (less frequent and random)
        this.platformSpawnTimer += deltaTime;
        if (this.platformSpawnTimer >= this.platformSpawnInterval) {
            this.spawnPlatform();
            this.platformSpawnTimer = 0;
            // Randomize next spawn time (6-12 seconds)
            this.platformSpawnInterval = 6000 + Math.random() * 6000;
        }
        
        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.update(deltaTime, this.difficulty);
            
            // Remove obstacles that are off screen
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
                this.score += 10; // Points for dodging
            }
        });
        
        // Update platforms
        this.platforms.forEach((platform, index) => {
            platform.update(deltaTime, this.difficulty);
            
            // Remove platforms that are off screen
            if (platform.x + platform.width < 0) {
                this.platforms.splice(index, 1);
            }
        });
        
        // Check collisions
        this.checkCollisions();
        
        // Update score
        this.score += Math.floor(deltaTime / 100); // 1 point per 100ms survived
        this.updateUI();
    }
    
    spawnObstacle() {
        const obstacleTypes = ['paperAirplane', 'textbook', 'apple', 'pencil', 'backpack', 'lunchTray'];
        
        // Gradually introduce more obstacle types
        let availableTypes = obstacleTypes;
        if (this.gameTime < 5000) {
            availableTypes = ['paperAirplane', 'apple'];
        } else if (this.gameTime < 15000) {
            availableTypes = ['paperAirplane', 'apple', 'pencil', 'textbook'];
        }
        
        const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        const obstacle = new Obstacle(type, this.width, this.height);
        this.obstacles.push(obstacle);
    }
    
    createPlatforms() {
        // Create initial platforms (fewer and more spread out)
        for (let i = 0; i < 2; i++) {
            const platform = new Platform(this.width + i * 400, this.height);
            this.platforms.push(platform);
        }
    }
    
    spawnPlatform() {
        // Spawn a new platform at random intervals
        const platform = new Platform(this.width, this.height);
        this.platforms.push(platform);
    }
    
    checkCollisions() {
        // Check obstacle collisions
        this.obstacles.forEach((obstacle, index) => {
            if (this.player.checkCollision(obstacle)) {
                // Player hit!
                this.player.takeDamage();
                this.obstacles.splice(index, 1);
                
                if (this.player.health <= 0) {
                    this.gameOver();
                }
            }
        });
        
        // Check platform collisions (for landing on tables)
        this.platforms.forEach(platform => {
            this.player.checkPlatformCollision(platform);
        });
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw background
        this.background.render(this.ctx);
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.render(this.ctx);
        });
        
        // Draw platforms
        this.platforms.forEach(platform => {
            platform.render(this.ctx);
        });
        
        // Draw player
        this.player.render(this.ctx);
        
        // Draw pause overlay
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            // Pause text
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 48px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.width / 2, this.height / 2 - 20);
            
            // Resume instruction
            this.ctx.font = '24px Courier New';
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillText('Press P to Resume', this.width / 2, this.height / 2 + 30);
            
            // Additional instructions
            this.ctx.font = '16px Courier New';
            this.ctx.fillStyle = '#CCCCCC';
            this.ctx.fillText('Press R to Restart', this.width / 2, this.height / 2 + 60);
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        
        // Update hearts
        const hearts = document.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            if (index < this.player.health) {
                heart.classList.remove('lost');
            } else {
                heart.classList.add('lost');
            }
        });
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Background class for school hallway
class Background {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.scrollX = 0;
    }
    
    render(ctx) {
        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Floor
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, this.height - 60, this.width, 60);
        
        // Lockers (repeating pattern) - Much more realistic
        for (let x = -this.scrollX % 120; x < this.width + 120; x += 120) {
            // Locker frame/outline
            ctx.fillStyle = '#2C3E50'; // Dark blue-gray frame
            ctx.fillRect(x, this.height - 220, 100, 160);
            
            // Individual locker doors (3 rows, 2 columns)
            const doorWidth = 45;
            const doorHeight = 50;
            const startY = this.height - 210;
            
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 2; col++) {
                    const doorX = x + 5 + col * (doorWidth + 5);
                    const doorY = startY + row * (doorHeight + 5);
                    
                    // Locker door
                    ctx.fillStyle = '#34495E'; // Darker blue-gray
                    ctx.fillRect(doorX, doorY, doorWidth, doorHeight);
                    
                    // Door border/frame
                    ctx.strokeStyle = '#2C3E50';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);
                    
                    // Locker handle
                    ctx.fillStyle = '#BDC3C7'; // Silver handle
                    ctx.fillRect(doorX + doorWidth - 8, doorY + doorHeight/2 - 3, 6, 6);
                    
                    // Locker number (small text)
                    ctx.fillStyle = '#ECF0F1';
                    ctx.font = '8px Arial';
                    ctx.textAlign = 'center';
                    const lockerNum = (row * 2 + col + 1);
                    ctx.fillText(lockerNum.toString(), doorX + doorWidth/2, doorY + doorHeight/2 + 3);
                    
                    // Vent slots (horizontal lines)
                    ctx.fillStyle = '#2C3E50';
                    for (let i = 0; i < 3; i++) {
                        ctx.fillRect(doorX + 5, doorY + 10 + i * 8, doorWidth - 10, 2);
                    }
                    
                    // Lock mechanism
                    ctx.fillStyle = '#E74C3C'; // Red lock
                    ctx.fillRect(doorX + 5, doorY + 5, 8, 6);
                }
            }
            
            // Locker combination locks (some open, some closed)
            ctx.fillStyle = '#95A5A6';
            ctx.fillRect(x + 15, this.height - 200, 12, 8);
            ctx.fillRect(x + 60, this.height - 200, 12, 8);
            ctx.fillRect(x + 15, this.height - 145, 12, 8);
            ctx.fillRect(x + 60, this.height - 145, 12, 8);
            ctx.fillRect(x + 15, this.height - 90, 12, 8);
            ctx.fillRect(x + 60, this.height - 90, 12, 8);
            
            // Locker base/platform
            ctx.fillStyle = '#7F8C8D';
            ctx.fillRect(x, this.height - 60, 100, 10);
            
            // Locker shadows for depth
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(x + 2, this.height - 218, 96, 156);
        }
        
        // Windows
        ctx.fillStyle = '#87CEEB';
        for (let x = -this.scrollX % 150; x < this.width + 150; x += 150) {
            ctx.fillRect(x, 50, 100, 80);
            // Window frame
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 3;
            ctx.strokeRect(x, 50, 100, 80);
        }
        
        // Scroll background slowly
        this.scrollX += 0.5;
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
});
