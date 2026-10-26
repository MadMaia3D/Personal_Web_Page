import { canvas, context, SetCanvasSize } from "../../shared/canvas.js"

import * as Mouse from "../../shared/mouse.js";
import { mouse, ButtonState } from "../../shared/mouse.js";
import * as Keyboard from "../../shared/keyboard.js";
import { keyboard, KeyState } from "../../shared/keyboard.js";

import { Vector2 as Vec2 } from "../../shared/vector2.js"
import { Clamp } from "../../shared/utility.js"

import * as Fire from "../doom_fire/fire.js"


SetCanvasSize(canvas, 900, 700);
Mouse.RegisterMouseEventsToHtmlElement(window);
Keyboard.RegisterKeyboardEventsToHtmlElement(window)


const image_data = context.createImageData(canvas.width, canvas.height);
const fire = Fire.Create(0, 0, 900, 700, 180, 140);
let is_fire_on = true;

const mouse_vector = new Vec2(0, 0);
let is_mouse_inside_canvas = false;


function Update(delta_time) {
    mouse_vector.Set(mouse.x, mouse.y);
    is_mouse_inside_canvas =
        0 <= mouse.x && mouse.x < canvas.width &&
        0 <= mouse.y && mouse.y < canvas.height;

    // Mouse Interaction
    if (is_mouse_inside_canvas) {
        let value_change = mouse.left == ButtonState.PRESSED ? 1 : -1;

        const clicked_cell = Fire.WorldSpaceToCellSpace(fire, mouse.x, mouse.y);
        const circle_radius = 15;

        const rect_left = Math.max(clicked_cell.x - circle_radius, 0);
        const rect_right = Math.min(clicked_cell.x + circle_radius, fire.columns);
        const rect_top = Math.max(clicked_cell.y - circle_radius, 0);
        const rect_bottom = Math.min(clicked_cell.y + circle_radius, fire.rows);

        for (let cy = rect_top; cy < rect_bottom; cy++) {
            for (let cx = rect_left; cx < rect_right; cx++) {
                const local_x = cx - clicked_cell.x;
                const local_y = cy - clicked_cell.y;
                const squared_dist_from_center = local_x * local_x + local_y * local_y;
                
                if (squared_dist_from_center < circle_radius * circle_radius) {
                    const cell_index = cx + cy * fire.columns;
                    const new_value = fire.data[cell_index] + value_change;
                    fire.data[cell_index] = Clamp(new_value, 0, 34);
                }
            }
        }
    }

    // Keyboard Interaction
    if (keyboard.space == KeyState.JUST_PRESSED) {
        is_fire_on = !is_fire_on;
    }

    Fire.TurnOnOff(fire, is_fire_on);
    Fire.Update(fire);
}


function Render() {
    Fire.RenderToImageData(fire, image_data);
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
    Fire.TurnOnOff(fire, is_fire_on);
    requestAnimationFrame(GameLoop);
}


StartLoop();
