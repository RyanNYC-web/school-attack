// Player class
class Player {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Position and size
        this.x = 100;
        this.y = canvasHeight - 100;
        this.width = 30;
        this.height = 40;
        
        // Movement properties
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 200; // pixels per second
        this.jumpPower = 400;
        this.gravity = 800;
        this.friction = 0.8;
        
        // State
        this.onGround = false;
        this.health = 3;
        this.maxHealth = 3;
        this.isCrouching = false;
        this.facingRight = true;
        
        // Animation
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
    }
    
    reset() {
        this.x = 100;
        this.y = this.canvasHeight - 100;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = this.maxHealth;
        this.onGround = false;
        this.isCrouching = false;
        this.facingRight = true;
    }
    
    update(deltaTime, keys) {
        // Handle input
        this.handleInput(keys, deltaTime);
        
        // Apply gravity
        if (!this.onGround) {
            this.velocityY += this.gravity * deltaTime / 1000;
        }
        
        // Update position
        this.x += this.velocityX * deltaTime / 1000;
        this.y += this.velocityY * deltaTime / 1000;
        
        // Ground collision
        if (this.y >= this.canvasHeight - 100) {
            this.y = this.canvasHeight - 100;
            this.velocityY = 0;
            this.onGround = true;
        } else {
            this.onGround = false;
        }
        
        // Apply friction when on ground
        if (this.onGround) {
            this.velocityX *= this.friction;
        }
        
        // Keep player in bounds
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        }
        if (this.x + this.width > this.canvasWidth) {
            this.x = this.canvasWidth - this.width;
            this.velocityX = 0;
        }
        
        // Update animation
        this.animationFrame += this.animationSpeed;
    }
    
    handleInput(keys, deltaTime) {
        // Horizontal movement
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.velocityX = -this.speed;
            this.facingRight = false;
        } else if (keys['ArrowRight'] || keys['KeyD']) {
            this.velocityX = this.speed;
            this.facingRight = true;
        }
        
        // Jumping
        if ((keys['Space'] || keys['ArrowUp']) && this.onGround && !this.isCrouching) {
            this.velocityY = -this.jumpPower;
            this.onGround = false;
        }
        
        // Crouching
        this.isCrouching = keys['ArrowDown'] || keys['KeyS'];
    }
    
    takeDamage() {
        this.health--;
        // Add some visual feedback (flash effect could be added here)
    }
    
    checkCollision(obstacle) {
        // Simple AABB collision detection
        return this.x < obstacle.x + obstacle.width &&
               this.x + this.width > obstacle.x &&
               this.y < obstacle.y + obstacle.height &&
               this.y + this.height > obstacle.y;
    }
    
    checkPlatformCollision(platform) {
        // Check if player is landing on top of platform
        if (platform.isPlayerOnTop(this)) {
            // Player is on the platform
            this.y = platform.y - this.height;
            this.velocityY = 0;
            this.onGround = true;
        }
    }
    
    render(ctx) {
        // Save context state
        ctx.save();
        
        // Flip sprite if facing left
        if (!this.facingRight) {
            ctx.scale(-1, 1);
            ctx.translate(-this.x * 2 - this.width, 0);
        }
        
        if (this.isCrouching) {
            // CROUCHING POSE - Player is lower and more compact
            const crouchOffset = 15; // How much lower the player is when crouching
            
            // Draw legs first (crouched position)
            ctx.fillStyle = '#000080'; // Blue pants
            ctx.fillRect(this.x + 5, this.y + this.height - 5, 8, 8);
            ctx.fillRect(this.x + 17, this.y + this.height - 5, 8, 8);
            
            // Draw shoes (closer to body)
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x + 3, this.y + this.height + 3, 12, 4);
            ctx.fillRect(this.x + 15, this.y + this.height + 3, 12, 4);
            
            // Draw body (shorter when crouching)
            ctx.fillStyle = '#4169E1'; // Blue shirt
            ctx.fillRect(this.x, this.y + crouchOffset, this.width, this.height - crouchOffset);
            
            // Draw head (lower position)
            ctx.fillStyle = '#FDBCB4'; // Skin color
            const headSize = 10; // Slightly smaller head when crouching
            ctx.fillRect(this.x + 10, this.y + crouchOffset - headSize, headSize, headSize);
            
            // Draw hair
            ctx.fillStyle = '#8B4513'; // Brown hair
            ctx.fillRect(this.x + 9, this.y + crouchOffset - headSize - 2, 12, 5);
            
            // Draw eyes (looking forward/down when crouching)
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x + 12, this.y + crouchOffset - headSize + 2, 2, 2);
            ctx.fillRect(this.x + 16, this.y + crouchOffset - headSize + 2, 2, 2);
            
            // Draw backpack (slightly lower)
            ctx.fillStyle = '#FF6347'; // Red backpack
            ctx.fillRect(this.x - 5, this.y + 5 + crouchOffset, 8, 15);
            
            // Draw arms in crouching position (holding knees)
            ctx.fillStyle = '#FDBCB4'; // Skin color for arms
            ctx.fillRect(this.x - 3, this.y + 10 + crouchOffset, 6, 12);
            ctx.fillRect(this.x + this.width - 3, this.y + 10 + crouchOffset, 6, 12);
            
        } else {
            // STANDING POSE - Normal standing position
            // Draw player body (simple pixel art style)
            ctx.fillStyle = '#4169E1'; // Blue shirt
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            // Draw head
            ctx.fillStyle = '#FDBCB4'; // Skin color
            const headSize = 12;
            ctx.fillRect(this.x + 9, this.y - headSize, headSize, headSize);
            
            // Draw hair
            ctx.fillStyle = '#8B4513'; // Brown hair
            ctx.fillRect(this.x + 8, this.y - headSize - 2, 14, 6);
            
            // Draw eyes
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x + 11, this.y - headSize + 3, 2, 2);
            ctx.fillRect(this.x + 17, this.y - headSize + 3, 2, 2);
            
            // Draw backpack
            ctx.fillStyle = '#FF6347'; // Red backpack
            ctx.fillRect(this.x - 5, this.y + 5, 8, 20);
            
            // Draw legs
            ctx.fillStyle = '#000080'; // Blue pants
            ctx.fillRect(this.x + 5, this.y + this.height, 8, 15);
            ctx.fillRect(this.x + 17, this.y + this.height, 8, 15);
            
            // Draw shoes
            ctx.fillStyle = '#000';
            ctx.fillRect(this.x + 3, this.y + this.height + 15, 12, 5);
            ctx.fillRect(this.x + 15, this.y + this.height + 15, 12, 5);
            
            // Draw arms in standing position
            ctx.fillStyle = '#FDBCB4'; // Skin color for arms
            ctx.fillRect(this.x - 3, this.y + 8, 6, 15);
            ctx.fillRect(this.x + this.width - 3, this.y + 8, 6, 15);
        }
        
        // Restore context state
        ctx.restore();
        
        // Draw collision box for debugging (remove in final version)
        if (false) { // Set to true to see collision boxes
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}
