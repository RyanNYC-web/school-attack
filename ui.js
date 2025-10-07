// UI Management class
class UIManager {
    constructor() {
        this.elements = {
            score: document.getElementById('score'),
            hearts: document.querySelectorAll('.heart'),
            finalScore: document.getElementById('finalScore'),
            highScore: document.getElementById('highScore'),
            startScreen: document.getElementById('startScreen'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            startBtn: document.getElementById('startBtn'),
            restartBtn: document.getElementById('restartBtn')
        };
        
        this.animations = {
            scoreFlash: false,
            heartPulse: false
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Button click handlers
        this.elements.startBtn.addEventListener('click', () => {
            this.hideStartScreen();
        });
        
        this.elements.restartBtn.addEventListener('click', () => {
            this.hideGameOverScreen();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyM') {
                this.toggleMute();
            }
        });
    }
    
    updateScore(score) {
        this.elements.score.textContent = score;
        
        // Flash effect for score milestones
        if (score > 0 && score % 100 === 0) {
            this.flashScore();
        }
    }
    
    updateHealth(health) {
        this.elements.hearts.forEach((heart, index) => {
            if (index < health) {
                heart.classList.remove('lost');
            } else {
                heart.classList.add('lost');
                this.pulseHeart(heart);
            }
        });
    }
    
    showStartScreen() {
        this.elements.startScreen.classList.remove('hidden');
    }
    
    hideStartScreen() {
        this.elements.startScreen.classList.add('hidden');
    }
    
    showGameOverScreen(finalScore, highScore) {
        this.elements.finalScore.textContent = finalScore;
        this.elements.highScore.textContent = highScore;
        this.elements.gameOverScreen.classList.remove('hidden');
    }
    
    hideGameOverScreen() {
        this.elements.gameOverScreen.classList.add('hidden');
    }
    
    flashScore() {
        this.animations.scoreFlash = true;
        this.elements.score.style.color = '#FFD700';
        this.elements.score.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            this.elements.score.style.color = '#333';
            this.elements.score.style.transform = 'scale(1)';
            this.animations.scoreFlash = false;
        }, 200);
    }
    
    pulseHeart(heart) {
        this.animations.heartPulse = true;
        heart.style.transform = 'scale(1.3)';
        heart.style.color = '#FF0000';
        
        setTimeout(() => {
            heart.style.transform = 'scale(1)';
            heart.style.color = '';
            this.animations.heartPulse = false;
        }, 300);
    }
    
    showPauseOverlay() {
        // Create pause overlay if it doesn't exist
        let pauseOverlay = document.getElementById('pauseOverlay');
        if (!pauseOverlay) {
            pauseOverlay = document.createElement('div');
            pauseOverlay.id = 'pauseOverlay';
            pauseOverlay.className = 'game-paused';
            pauseOverlay.textContent = 'PAUSED - Press P to resume';
            document.querySelector('.game-container').appendChild(pauseOverlay);
        }
        pauseOverlay.classList.remove('hidden');
    }
    
    hidePauseOverlay() {
        const pauseOverlay = document.getElementById('pauseOverlay');
        if (pauseOverlay) {
            pauseOverlay.classList.add('hidden');
        }
    }
    
    showComboMessage(comboCount) {
        // Create combo message
        const comboMsg = document.createElement('div');
        comboMsg.className = 'combo-message';
        comboMsg.textContent = `${comboCount}x COMBO!`;
        comboMsg.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #FFD700;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            z-index: 1000;
            animation: comboAnimation 1s ease-out forwards;
        `;
        
        // Add animation keyframes
        if (!document.getElementById('comboAnimation')) {
            const style = document.createElement('style');
            style.id = 'comboAnimation';
            style.textContent = `
                @keyframes comboAnimation {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(1) translateY(-50px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.querySelector('.game-container').appendChild(comboMsg);
        
        // Remove after animation
        setTimeout(() => {
            if (comboMsg.parentNode) {
                comboMsg.parentNode.removeChild(comboMsg);
            }
        }, 1000);
    }
    
    showDamageEffect() {
        // Create damage flash effect
        const damageFlash = document.createElement('div');
        damageFlash.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 0, 0, 0.3);
            z-index: 500;
            pointer-events: none;
            animation: damageFlash 0.3s ease-out;
        `;
        
        // Add damage flash animation
        if (!document.getElementById('damageFlashAnimation')) {
            const style = document.createElement('style');
            style.id = 'damageFlashAnimation';
            style.textContent = `
                @keyframes damageFlash {
                    0% { opacity: 0; }
                    50% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.querySelector('.game-container').appendChild(damageFlash);
        
        // Remove after animation
        setTimeout(() => {
            if (damageFlash.parentNode) {
                damageFlash.parentNode.removeChild(damageFlash);
            }
        }, 300);
    }
    
    toggleMute() {
        // Toggle sound (placeholder for future audio implementation)
        const isMuted = localStorage.getItem('gameMuted') === 'true';
        localStorage.setItem('gameMuted', (!isMuted).toString());
        
        // Show mute status
        this.showNotification(isMuted ? 'Sound ON' : 'Sound OFF');
    }
    
    showNotification(message, duration = 2000) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 2000;
            font-family: 'Courier New', monospace;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add slide animation
        if (!document.getElementById('slideInAnimation')) {
            const style = document.createElement('style');
            style.id = 'slideInAnimation';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }
    
    updateInstructions(showAdvanced = false) {
        const instructions = document.querySelector('.instructions');
        if (showAdvanced) {
            instructions.innerHTML = `
                <h3>Advanced Controls:</h3>
                <p>← → or A D - Move</p>
                <p>Spacebar or ↑ - Jump</p>
                <p>↓ or S - Crouch</p>
                <p>P - Pause</p>
                <p>R - Restart</p>
                <p>M - Toggle Sound</p>
            `;
        } else {
            instructions.innerHTML = `
                <h3>Controls:</h3>
                <p>← → or A D - Move</p>
                <p>Spacebar or ↑ - Jump</p>
                <p>↓ or S - Crouch</p>
                <p>P - Pause</p>
                <p>R - Restart</p>
            `;
        }
    }
}

