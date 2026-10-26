import { Create, IsWorldPositionInside, WorldSpaceToCellSpace, Fill, Clear } from "../../shared/grid_base.js"
export { Create, IsWorldPositionInside, WorldSpaceToCellSpace, Fill, Clear };

import * as Keyboard from "../../shared/keyboard.js";
import * as Mouse from "../../shared/keyboard.js";
import * as Image from "../../shared/image.js"
import { Wrap } from "../../shared/utility.js"

import * as Vector2 from "../../shared/vector2.js"
import { Vector2 as Vec2 } from "../../shared/vector2.js"


const camera_position = new Vec2(512, 512);
let travel_velocity = new Vec2(0, 0);
let camera_height = 100;
const look_direction = new Vec2(0, -1);

let camera_travel_speed = 100;

let fov = Math.PI / 180 * 90;
let draw_distance_far = 512;
let draw_distance_near = 1;
let vertical_projection_scale = 400;



export function CameraMouseInput(mouse, delta_time) {
    if (mouse.left == Mouse.KeyState.PRESSED) {
        const mouse_delta_x = (mouse.x - mouse.previous_x) / 900;
        look_direction.Rotate(mouse_delta_x * fov * 2);
    }
}

export function CameraKeyboardInput(keyboard, height_map, delta_time) {
    travel_velocity.Set(0, 0);
    const right_direction = Vector2.GetRotated90Clockwise(look_direction);
    
    if (keyboard.w == Keyboard.KeyState.PRESSED) {
        travel_velocity.Add(look_direction);
    }
    if (keyboard.s == Keyboard.KeyState.PRESSED) {
        travel_velocity.Sub(look_direction);
    }
    if (keyboard.d == Keyboard.KeyState.PRESSED) {
        travel_velocity.Add(right_direction);
    }
    if (keyboard.a == Keyboard.KeyState.PRESSED) {
        travel_velocity.Sub(right_direction);
    }
    
    camera_position.Add(travel_velocity.Mult(camera_travel_speed * delta_time));

    if (keyboard.space == Keyboard.KeyState.PRESSED) {
        camera_height += camera_travel_speed * delta_time;
    }
    if (keyboard.ctrl == Keyboard.KeyState.PRESSED) {
        camera_height -= camera_travel_speed * delta_time;
    }

    camera_position.x = Wrap(camera_position.x, 0, height_map.width);
    camera_position.y = Wrap(camera_position.y, 0, height_map.height);
    
    const terrain_index = (Math.floor(camera_position.x) + Math.floor(camera_position.y) * height_map.width) * 4;
    const terrain_height = height_map.data[terrain_index];

    if (camera_height < terrain_height + 5) {
        camera_height = terrain_height + 5;
    }
}

export function Render(image_data, height_map, color_map) {
    Image.Fill(image_data, 128, 200, 255);

    // look_vector is the same as look_direction but scaled by draw_distance_far
    // I'ts the vector to the far center of the frustum
    const look_vector = Vector2.Mult(look_direction, draw_distance_far);
    // half_view_vector is perpendicular to look_vector and has half width size
    // It's the vector from the far center to the far right of the frustum
    // const perpendicular_look_vector = Vector2.GetRotated(look_direction, Math.PI / 2);
    const perpendicular_look_vector = Vector2.GetRotated90Clockwise(look_direction);
    const half_view_width = Math.tan(fov / 2) * draw_distance_far;
    const half_view_vector = Vector2.Mult(perpendicular_look_vector, half_view_width);

    // view_far_left and view_far_right are vectors that points from the camera
    // to the left and right borders of the frustum in world space
    const view_far_left = Vector2.Add(camera_position, look_vector).Sub(half_view_vector);
    const view_far_right = Vector2.Add(camera_position, look_vector).Add(half_view_vector);

    // we determina the percentage of each pixel column of the destination image
    const width_step = 1.0 / image_data.width;

    const buffer = new Array(image_data.width).fill(image_data.height);
    for (let z = draw_distance_near; z < draw_distance_far; z++) {
        const far_to_position_percentage = z / draw_distance_far;
        const current_left = Vector2.Lerp(camera_position, view_far_left, far_to_position_percentage);
        const current_right = Vector2.Lerp(camera_position, view_far_right, far_to_position_percentage);

        for (let cx = 0; cx < image_data.width; cx++) {
            const current_map_position = Vector2.Lerp(current_left, current_right, (cx + 0.5) * width_step)

            current_map_position.x = Math.floor(Wrap(current_map_position.x, 0, height_map.width));
            current_map_position.y = Math.floor(Wrap(current_map_position.y, 0, height_map.height));

            const height_map_index = (current_map_position.x + current_map_position.y * height_map.width) * 4;
            const height_value = height_map.data[height_map_index];

            const terrain_camera_height_diff = height_value - camera_height;
            const pixel_offset = terrain_camera_height_diff / z * vertical_projection_scale;
            const screen_terrain_height = Math.floor(Math.max(0, image_data.height / 2 - pixel_offset));

            if (screen_terrain_height < buffer[cx]) {
                const color_map_index = (current_map_position.x + current_map_position.y * color_map.width) * 4;
                const r = color_map.data[color_map_index];
                const g = color_map.data[color_map_index + 1];
                const b = color_map.data[color_map_index + 2];

                for (let cy = screen_terrain_height; cy < buffer[cx]; cy++) {
                    Image.SetPixel(image_data, cx, cy, r, g, b);
                }
                buffer[cx] = screen_terrain_height;
            }
        }
    }
}
