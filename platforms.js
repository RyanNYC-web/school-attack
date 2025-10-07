// Platform class for tables and other jumpable surfaces
class Platform {
    constructor(x, canvasHeight) {
        this.x = x;
        this.y = canvasHeight - 150; // Height of the platform above ground
        this.width = 80;
        this.height = 15;
        this.canvasHeight = canvasHeight;
        
        // Movement (platforms scroll with the background)
        this.scrollSpeed = 50; // pixels per second
        
        // Visual properties
        this.color = '#8B4513'; // Brown table color
        this.legColor = '#654321'; // Darker brown for legs
    }
    
    update(deltaTime, difficulty) {
        // Move platform to the left (scrolling effect)
        this.x -= this.scrollSpeed * deltaTime / 1000 * difficulty;
    }
    
    render(ctx) {
        // Draw table legs
        ctx.fillStyle = this.legColor;
        ctx.fillRect(this.x + 5, this.y + this.height, 8, 20);
        ctx.fillRect(this.x + this.width - 13, this.y + this.height, 8, 20);
        
        // Draw table top
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw table edge/rim
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Draw some table details (wood grain effect)
        ctx.fillStyle = '#A0522D';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(this.x + 5, this.y + 3 + i * 3, this.width - 10, 1);
        }
        
        // Draw collision box for debugging (remove in final version)
        if (false) { // Set to true to see collision boxes
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    
    // Check if player is on top of this platform
    isPlayerOnTop(player) {
        return player.x < this.x + this.width &&
               player.x + player.width > this.x &&
               player.y + player.height >= this.y &&
               player.y + player.height <= this.y + this.height + 5 &&
               player.velocityY >= 0; // Player is falling or stationary
    }
}

