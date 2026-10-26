import { canvas, context, SetCanvasSize } from "../../shared/canvas.js"

import * as Mouse from "../../shared/mouse.js";
import { mouse } from "../../shared/mouse.js";
import * as Keyboard from "../../shared/keyboard.js";
import { keyboard } from "../../shared/keyboard.js";

import * as Engine from "./engine.js"
import * as Image from "../../shared/image.js"


SetCanvasSize(canvas, 900, 700);
Mouse.RegisterMouseEventsToHtmlElement(window);
Keyboard.RegisterKeyboardEventsToHtmlElement(window)


const image_data = context.createImageData(canvas.width, canvas.height);
export let height_map = await Image.Load("./images/D1.png")
export let color_map = await Image.Load("./images/C1W.png")


function Update(delta_time) {
    Engine.CameraMouseInput(mouse);
    Engine.CameraKeyboardInput(keyboard, height_map, delta_time);
}


function Render() {
    Engine.Render(image_data, height_map, color_map);
}


let last_timestamp = 0;

function GameLoop(timestamp) {
    let delta_time = (timestamp - last_timestamp) / 1000;
    delta_time = Math.min(delta_time, 0.033);
    last_timestamp = timestamp;

    Mouse.Update(mouse);
    Mouse.WindowSpaceToCanvasSpace(mouse, canvas)
    Keyboard.Update(keyboard);

    Update(delta_time);
    Render();
    context.putImageData(image_data, 0, 0);

    requestAnimationFrame(GameLoop);
}


function StartLoop() {
    requestAnimationFrame(GameLoop);
}


StartLoop();
