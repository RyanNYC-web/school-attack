// Collision detection utilities
class CollisionDetector {
    static checkAABBCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    static checkCircleCollision(circle1, circle2) {
        const dx = circle1.x - circle2.x;
        const dy = circle1.y - circle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < circle1.radius + circle2.radius;
    }
    
    static checkPointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    }
    
    // More precise collision detection for rotated objects
    static checkRotatedRectCollision(rect1, rect2, rotation1 = 0, rotation2 = 0) {
        // For now, we'll use simple AABB collision
        // In a more advanced implementation, you could use SAT (Separating Axis Theorem)
        return this.checkAABBCollision(rect1, rect2);
    }
    
    // Collision response - what happens when objects collide
    static handleCollision(obj1, obj2, collisionType = 'default') {
        switch (collisionType) {
            case 'player_obstacle':
                // Player takes damage
                if (obj1.takeDamage) {
                    obj1.takeDamage();
                }
                break;
                
            case 'bounce':
                // Simple bounce physics
                const tempVelX = obj1.velocityX;
                const tempVelY = obj1.velocityY;
                obj1.velocityX = obj2.velocityX * 0.8;
                obj1.velocityY = obj2.velocityY * 0.8;
                obj2.velocityX = tempVelX * 0.8;
                obj2.velocityY = tempVelY * 0.8;
                break;
                
            default:
                // Default collision - objects stop
                if (obj1.velocityX !== undefined) obj1.velocityX = 0;
                if (obj1.velocityY !== undefined) obj1.velocityY = 0;
                if (obj2.velocityX !== undefined) obj2.velocityX = 0;
                if (obj2.velocityY !== undefined) obj2.velocityY = 0;
        }
    }
    
    // Get collision normal (direction of collision)
    static getCollisionNormal(rect1, rect2) {
        const center1 = {
            x: rect1.x + rect1.width / 2,
            y: rect1.y + rect1.height / 2
        };
        const center2 = {
            x: rect2.x + rect2.width / 2,
            y: rect2.y + rect2.height / 2
        };
        
        const dx = center2.x - center1.x;
        const dy = center2.y - center1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) return { x: 0, y: 0 };
        
        return {
            x: dx / distance,
            y: dy / distance
        };
    }
    
    // Check if object is within screen bounds
    static isWithinBounds(obj, canvasWidth, canvasHeight, margin = 0) {
        return obj.x >= -margin &&
               obj.x + obj.width <= canvasWidth + margin &&
               obj.y >= -margin &&
               obj.y + obj.height <= canvasHeight + margin;
    }
    
    // Get objects that are colliding with a given object
    static getCollidingObjects(targetObj, objectArray) {
        return objectArray.filter(obj => {
            if (obj === targetObj) return false;
            return this.checkAABBCollision(targetObj, obj);
        });
    }
    
    // Spatial partitioning for better performance with many objects
    static createSpatialGrid(canvasWidth, canvasHeight, cellSize = 100) {
        const grid = {};
        const cols = Math.ceil(canvasWidth / cellSize);
        const rows = Math.ceil(canvasHeight / cellSize);
        
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                grid[`${x},${y}`] = [];
            }
        }
        
        return {
            grid,
            cellSize,
            cols,
            rows,
            addObject: function(obj) {
                const cellX = Math.floor(obj.x / this.cellSize);
                const cellY = Math.floor(obj.y / this.cellSize);
                const key = `${cellX},${cellY}`;
                
                if (this.grid[key]) {
                    this.grid[key].push(obj);
                }
            },
            getNearbyObjects: function(obj) {
                const cellX = Math.floor(obj.x / this.cellSize);
                const cellY = Math.floor(obj.y / this.cellSize);
                const nearby = [];
                
                // Check current cell and adjacent cells
                for (let x = cellX - 1; x <= cellX + 1; x++) {
                    for (let y = cellY - 1; y <= cellY + 1; y++) {
                        const key = `${x},${y}`;
                        if (this.grid[key]) {
                            nearby.push(...this.grid[key]);
                        }
                    }
                }
                
                return nearby;
            },
            clear: function() {
                for (let key in this.grid) {
                    this.grid[key] = [];
                }
            }
        };
    }
}
