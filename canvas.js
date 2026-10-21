var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;
let context = canvas.getContext('2d');

// colors
// context.fillStyle = "#00aaaa"; // any css color value including alpha or not
// context.strokeStyle = "#ff0000";

// stroke and fill
// context.moveTo(x, y);
// context.beginPath();
// context.stroke();
// context.fill();

// drawing shapes
// context.fillRect(x, y, w, h);
// context.lineTo(x, y);
// context.arc(x, y, radius, startAngle, endAngle);

// requestAnimationFrame(callback)
    

function CreateBall(x, y, radius) {
    const Ball = {
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        radius: radius,
        color: '#888888'
    };
    return Ball;
}

function UpdateBall(ball) {
    // ball.vy += 0.5;

    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.y - ball.radius < 0) {
        let overflow = ball.y - ball.radius;
        ball.y -= overflow * 2;
        ball.vy = -ball.vy;
    } else if (ball.y + ball.radius > innerHeight) {
        let overflow = ball.y + ball.radius - innerHeight;
        ball.y -= overflow * 2;
        ball.vy = -ball.vy;

    }

    if (ball.x - ball.radius < 0) {
        let overflow = ball.x - ball.radius;
        ball.x -= overflow * 2;
        ball.vx = -ball.vx;
    } else if (ball.x + ball.radius > innerWidth) {
        let overflow = ball.x + ball.radius - innerWidth;
        ball.x -= overflow * 2;
        ball.vx = -ball.vx;
    }
}

function DrawBall(ball) {
    context.strokeStyle = ball.color;
    context.fillStyle = ball.color;
    
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.stroke();

    context.fill();
}

function RandomRange(min, max) {
    return Math.random() * (max - min) + min;
}


function CreateColor(r, g, b, a) {
    if (g == undefined) {
        return `rgb(${r}, ${r}, ${r})`;
    } else if (b == undefined) {
        return `rgb(${r}, ${r}, ${g})`;
    } else if (a == undefined) {
        return `rgb(${r}, ${g}, ${b})`;
    }
    return `rgb(${r}, ${g}, ${b}, ${a})`;
}

function Update() {
    for (let i = 0; i < ballsArray.length; i++) {
        UpdateBall(ballsArray[i]);
    }
}

function Render() {
    context.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = 0; i < ballsArray.length; i++) {
        DrawBall(ballsArray[i]);
    }
}

function AnimationLoop() {
    Update();
    Render();
    requestAnimationFrame(AnimationLoop);
}

function StartAnimationLoop() {
    requestAnimationFrame(AnimationLoop);
}


let ballsArray = [];
let colorsArray = ['#ebeff3', '#a2bdc8', '#242c32', '#ff4f26'];


for (let i = 0; i < 300; i++) {
    let radius = RandomRange(5, 15);
    let x = RandomRange(radius, innerWidth - radius);;
    let y = RandomRange(radius, innerHeight - radius);
    let velocity = 5;
    let ball = CreateBall(x, y, radius);

    ball.vx = RandomRange(-velocity, velocity);
    ball.vy = RandomRange(-velocity, velocity);
    ball.color = colorsArray[Math.floor(Math.random() * 4)];
    
    ballsArray.push(ball);
}

StartAnimationLoop();
