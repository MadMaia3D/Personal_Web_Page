function GetCanvas() {
    return document.querySelector("canvas");
}

function GetCanvasContext(canvas) {
    return canvas.getContext('2d');
}


export let canvas = GetCanvas();
export let context = GetCanvasContext(canvas);


export function SetCanvasSize(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
}

// window.addEventListener('resize', function (event) {
//     SetCanvasSize(canvas, window.innerWidth, window.innerHeight);
// })

canvas.addEventListener("contextmenu", function (event) {
    event.preventDefault();
})
