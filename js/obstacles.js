// Obstacle class for flying school objects
class Obstacle {
    constructor(type, canvasWidth, canvasHeight) {
        this.type = type;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        
        // Set properties based on obstacle type
        this.setProperties();
        
        // Position (spawn from right side of screen)
        this.x = canvasWidth;
        this.y = this.getSpawnY();
        
        // Movement
        this.velocityX = -this.speed;
        this.velocityY = 0;
        
        // Rotation for visual effect
        this.rotation = 0;
        this.rotationSpeed = Math.random() * 0.1 - 0.05;
    }
    
    setProperties() {
        switch (this.type) {
            case 'paperAirplane':
                this.width = 20;
                this.height = 15;
                this.speed = 150;
                this.color = '#FFFFFF';
                this.emoji = '✈️';
                break;
                
            case 'textbook':
                this.width = 25;
                this.height = 35;
                this.speed = 100;
                this.color = '#8B4513';
                this.emoji = '📚';
                break;
                
            case 'apple':
                this.width = 18;
                this.height = 18;
                this.speed = 80;
                this.color = '#FF0000';
                this.emoji = '🍎';
                break;
                
            case 'pencil':
                this.width = 8;
                this.height = 30;
                this.speed = 200;
                this.color = '#FFD700';
                this.emoji = '✏️';
                break;
                
            case 'backpack':
                this.width = 35;
                this.height = 45;
                this.speed = 60;
                this.color = '#FF6347';
                this.emoji = '🎒';
                break;
                
            case 'lunchTray':
                this.width = 40;
                this.height = 25;
                this.speed = 90;
                this.color = '#C0C0C0';
                this.emoji = '🍽️';
                break;
                
            default:
                this.width = 20;
                this.height = 20;
                this.speed = 100;
                this.color = '#808080';
                this.emoji = '❓';
        }
    }
    
    getSpawnY() {
        // Spawn at different heights based on type
        const groundLevel = this.canvasHeight - 100;
        
        switch (this.type) {
            case 'paperAirplane':
                // High flying
                return groundLevel - 80 + Math.random() * 40;
            case 'pencil':
                // Can be thrown at any height
                return groundLevel - 60 + Math.random() * 60;
            case 'apple':
                // Usually thrown low
                return groundLevel - 30 + Math.random() * 30;
            case 'textbook':
                // Heavy, usually thrown low
                return groundLevel - 20 + Math.random() * 20;
            case 'backpack':
                // Heavy, low trajectory
                return groundLevel - 10 + Math.random() * 10;
            case 'lunchTray':
                // Medium height
                return groundLevel - 40 + Math.random() * 40;
            default:
                return groundLevel - 30 + Math.random() * 30;
        }
    }
    
    update(deltaTime, difficulty) {
        // Move obstacle
        this.x += this.velocityX * deltaTime / 1000 * difficulty;
        
        // Apply some physics (gravity for heavier objects)
        if (this.type === 'textbook' || this.type === 'backpack' || this.type === 'lunchTray') {
            this.velocityY += 200 * deltaTime / 1000; // Gravity
            this.y += this.velocityY * deltaTime / 1000;
            
            // Bounce off ground
            const groundLevel = this.canvasHeight - 100;
            if (this.y + this.height > groundLevel) {
                this.y = groundLevel - this.height;
                this.velocityY *= -0.3; // Bounce with energy loss
            }
        }
        
        // Update rotation
        this.rotation += this.rotationSpeed;
    }
    
    render(ctx) {
        ctx.save();
        
        // Move to obstacle center for rotation
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        // Draw obstacle shadow first
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 2, this.width, this.height);
        
        // Draw main obstacle
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Add some detail based on type
        this.drawDetails(ctx);
        
        ctx.restore();
        
        // Draw collision box for debugging (remove in final version)
        if (false) { // Set to true to see collision boxes
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    
    drawDetails(ctx) {
        ctx.fillStyle = '#000';
        
        switch (this.type) {
            case 'paperAirplane':
                // Draw airplane shape
                ctx.beginPath();
                ctx.moveTo(-this.width / 2, 0);
                ctx.lineTo(this.width / 2, -this.height / 2);
                ctx.lineTo(this.width / 2, this.height / 2);
                ctx.closePath();
                ctx.fill();
                break;
                
            case 'textbook':
                // Draw book pages
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 2, this.width - 4, this.height - 4);
                ctx.fillStyle = '#000';
                ctx.fillRect(-this.width / 2 + 4, -this.height / 2 + 4, this.width - 8, 2);
                break;
                
            case 'apple':
                // Draw apple stem
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(-2, -this.height / 2, 4, 6);
                // Draw leaf
                ctx.fillStyle = '#228B22';
                ctx.fillRect(2, -this.height / 2 + 2, 6, 4);
                break;
                
            case 'pencil':
                // Draw pencil tip
                ctx.fillStyle = '#FF69B4';
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, 6);
                // Draw eraser
                ctx.fillStyle = '#FFB6C1';
                ctx.fillRect(-this.width / 2, this.height / 2 - 6, this.width, 6);
                break;
                
            case 'backpack':
                // Draw straps
                ctx.fillStyle = '#000';
                ctx.fillRect(-this.width / 2 + 5, -this.height / 2, 3, 15);
                ctx.fillRect(this.width / 2 - 8, -this.height / 2, 3, 15);
                // Draw zipper
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(-this.width / 2 + 2, 0, this.width - 4, 2);
                break;
                
            case 'lunchTray':
                // Draw tray compartments
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 2, this.width - 4, this.height - 4);
                // Draw divider lines
                ctx.fillStyle = '#C0C0C0';
                ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 8, this.width - 4, 1);
                ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 16, this.width - 4, 1);
                break;
        }
    }
}

