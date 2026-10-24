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

// export function GetImageData(context) {
//     return context.createImageData(width, height);
// }

export function SetPixel(image_data, x, y, r, g, b) {
    const index = (x + y * image_data.width) * 4;
    image_data.data[index + 0] = r;
    image_data.data[index + 1] = g;
    image_data.data[index + 2] = b;
    image_data.data[index + 3] = 255;
}

// window.addEventListener('resize', function (event) {
//     SetCanvasSize(canvas, window.innerWidth, window.innerHeight);
// })

canvas.addEventListener("contextmenu", function (event) {
    event.preventDefault();
})
