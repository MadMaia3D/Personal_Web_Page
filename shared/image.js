export async function Load(path) {
    const img = new Image();
    img.src = path;
    await img.decode();

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext("2d", {
        willReadFrequently: true
    });

    ctx.drawImage(img, 0, 0);

    const image_data = ctx.getImageData(
        0, 0, canvas.width, canvas.height
    );

    return image_data;
}


export function GetPixel(x, y, image_data) {
    const i = (y * image_data.width + x) * 4;

    return image_data.data.subarray(i, i + 4);
}


export function SetPixel(image_data, x, y, r, g, b) {
    const index = (x + y * image_data.width) * 4;
    image_data.data[index + 0] = r;
    image_data.data[index + 1] = g;
    image_data.data[index + 2] = b;
    image_data.data[index + 3] = 255;
}


export function Clear(image_data) {
    image_data.data.fill(0);
}


export function Fill(image_data, r, g, b) {
    for (let i = 0; i < image_data.width * image_data.height; i++) {
        image_data.data[i * 4 + 0] = r;
        image_data.data[i * 4 + 1] = g;
        image_data.data[i * 4 + 2] = b;
        image_data.data[i * 4 + 3] = 255;
    }
}
