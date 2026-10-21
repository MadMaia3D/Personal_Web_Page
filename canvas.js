var canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let context = canvas.getContext('2d');

context.fillStyle = "#00aaaa55"; // any css color value including alpha or not
// rectangle
let rect_width = 48;
let rect_gap = 32;
for (let i = 0; i < 15; i++) {
    context.fillRect(100 + i * (rect_width + rect_gap), 50, rect_width, 500);
}

context.strokeStyle = "#ff0000"; // any css color value including alpha or not
// line
context.beginPath();
context.moveTo(50, window.innerHeight / 4);
for (let i = 0; i < 100; i++) {
    context.lineTo(50 + i * 5, window.innerHeight / 4  + Math.sin(i/5) * 15);
}
context.stroke();

// arc
context.strokeStyle = "#0000ff";
context.strokeStyle = Math.random() * 255;
for (let i = 0; i < 100; i++) {
    let x = Math.random() * window.innerWidth;
    let y = Math.random() * window.innerHeight;
    context.beginPath();
    context.arc(x, y, 50, 0, Math.PI * 2.0);
    context.stroke();
}

console.log(canvas);
