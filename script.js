const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const portal = document.getElementById("portal");

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const MAX_SCORE = 20;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let score = 0;
let gameOver = false;

let food = { x: 5, y: 5 };
let touchStartX = 0;
let touchStartY = 0;

// Gradual speed variables
let speed = 5; // cells per second
let lastUpdate = 0;

// Petal trail
let petals = [];

// Main game loop using time-based movement
function gameLoop(timestamp) {
    if (gameOver) return;

    const delta = timestamp - lastUpdate;
    const interval = 1000 / speed; // milliseconds per cell
    if (delta >= interval) {
        lastUpdate = timestamp;
        update();
    }

    updatePetals();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update snake position
function update() {
    if (velocity.x === 0 && velocity.y === 0) return;

    const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
        return;
    }

    // Self collision
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
            return;
        }
    }

    // Add petal at previous head
    petals.push({ x: snake[0].x, y: snake[0].y, life: 20 });

    // Move snake
    snake.unshift(head);

    // Eating food
    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        placeFood();

        // Gradual speed increase
        speed += 0.2; // small increment per lily

        // Check for win
        if (score === MAX_SCORE) triggerPortal();
    } else {
        snake.pop();
    }
}

// Update petal trail
function updatePetals() {
    petals.forEach(p => p.life--);
    petals = petals.filter(p => p.life > 0);
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw petals
    petals.forEach(p => {
        const alpha = p.life / 20; // 0-1
        ctx.fillStyle = "rgba(255,182,193," + alpha + ")";
        ctx.beginPath();
        ctx.arc(p.x * gridSize + gridSize/2, p.y * gridSize + gridSize/2, gridSize/4, 0, Math.PI*2);
        ctx.fill();
    });

    // Draw snake body
    for (let i = 1; i < snake.length; i++) {
        const part = snake[i];
        const greenShade = 50 + i * 10;
        ctx.fillStyle = "rgb(22," + greenShade + ",94)";
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize-2, gridSize-2);
    }

    // Snake head 🌸
    const head = snake[0];
    ctx.font = gridSize + "px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🌸", head.x * gridSize + gridSize/2, head.y * gridSize + gridSize/2);

    // Glowing lily 🪷
    const time = Date.now() * 0.005;
    const scale = 1 + 0.2 * Math.sin(time);
    const alpha = 0.7 + 0.3 * Math.sin(time * 2);
    ctx.save();
    ctx.font = gridSize * scale + "px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255,255,255," + alpha + ")";
    ctx.shadowBlur = 15;
    ctx.fillText("🪷", food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2);
    ctx.restore();
}

// Place food
function placeFood() {
    let valid = false;
    while (!valid) {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
        valid = !snake.some(s => s.x === food.x && s.y === food.y);
    }
}

// Reset game
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    velocity = { x: 0, y: 0 };
    score = 0;
    speed = 5; // reset speed
    petals = [];
    scoreDisplay.textContent = score;
    placeFood();
}

// Trigger portal
function triggerPortal() {
    gameOver = true;
    portal.classList.add("show");
    setTimeout(() => window.location.href = "win.html", 2000);
}

// Mobile swipe
canvas.addEventListener("touchstart", e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, {passive:true});

canvas.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && velocity.x === 0) velocity = {x:1,y:0};
        else if (dx < 0 && velocity.x === 0) velocity = {x:-1,y:0};
    } else {
        if (dy > 0 && velocity.y === 0) velocity = {x:0,y:1};
        else if (dy < 0 && velocity.y === 0) velocity = {x:0,y:-1};
    }
}, {passive:true});

// Keyboard
document.addEventListener("keydown", e => {
    switch(e.key){
        case "ArrowUp": if(velocity.y===0) velocity={x:0,y:-1}; break;
        case "ArrowDown": if(velocity.y===0) velocity={x:0,y:1}; break;
        case "ArrowLeft": if(velocity.x===0) velocity={x:-1,y:0}; break;
        case "ArrowRight": if(velocity.x===0) velocity={x:1,y:0}; break;
    }
});

// Start game
requestAnimationFrame(gameLoop);