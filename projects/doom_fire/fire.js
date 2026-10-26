import { Create, IsWorldPositionInside, WorldSpaceToCellSpace, Fill, Clear } from "../../shared/grid_base.js"
export { Create, IsWorldPositionInside, WorldSpaceToCellSpace, Fill, Clear };

import * as Image from "../../shared/image.js"    
import { Clamp, RandomRange } from "../../shared/utility.js"


export function TurnOnOff(fire, set) {
    const value = set ? fire_palette.length - 1 : 0; // fire_palette array is at the bottom of the file
    for (let x = 0; x < fire.columns; x++) {
        fire.data[x + (fire.rows - 1) * fire.columns] = value;
    }
}


export function Update(fire_board, min_decay, max_decay, min_wind, max_wind) {
    min_decay = min_decay ? min_decay : 0.0;
    max_decay = max_decay ? max_decay : 0.9;
    min_wind = min_wind ? min_wind : -2;
    max_wind = max_wind ? max_wind : 1;
    
    for (let cy = 1; cy < fire_board.rows; cy++) {
        for (let cx = 0; cx < fire_board.columns; cx++) {
            const wind = Math.round(RandomRange(min_wind, max_wind));
            const decay = Math.round(RandomRange(min_decay, max_decay));

            const source_cell_index = cx + cy * fire_board.columns;
            const source_value = fire_board.data[source_cell_index];
            const destination_cell_index = Math.floor(source_cell_index - fire_board.columns);

            fire_board.data[destination_cell_index + wind] = Math.max(source_value - decay, 0);
        }
    }
}


export function RenderToImageData(fire_board, image_data) {
    const cell_width = fire_board.width / fire_board.columns;
    const cell_height = fire_board.height / fire_board.rows;

    const start_x = Math.max(fire_board.x, 0);
    const start_y = Math.max(fire_board.y, 0);
    const end_x = Math.min(fire_board.x + fire_board.width, image_data.width);
    const end_y = Math.min(fire_board.y + fire_board.height, image_data.width);

    for (let cy = start_y; cy < end_y; cy++) {
        for (let cx = start_x; cx < end_x; cx++) {
            const cell_x = Math.floor((cx - fire_board.x) / cell_width);
            const cell_y = Math.floor((cy - fire_board.y) / cell_height);
            const cell_index = cell_x + cell_y * fire_board.columns;
            const cell_value = Clamp(fire_board.data[cell_index], 0, fire_palette.length - 1);

            const r = fire_palette[cell_value][0];
            const g = fire_palette[cell_value][1];
            const b = fire_palette[cell_value][2];
            Image.SetPixel(image_data, cx, cy, r, g, b);
        }
    }
}


// This pallete was copied from the Dylan Garrett article on his site
// https://dylan-garrett.com/blog/doom-fire-love2d/
const fire_palette = [
    [7, 7, 7],
    [28, 8, 8],
    [43, 17, 9],
    [65, 19, 11],
    [80, 28, 13],
    [95, 36, 16],
    [110, 38, 18],
    [133, 47, 22],
    [148, 55, 25],
    [163, 70, 30],
    [178, 79, 33],
    [185, 80, 34],
    [208, 89, 39],
    [208, 96, 40],
    [208, 96, 40],
    [201, 102, 41],
    [202, 109, 45],
    [195, 115, 45],
    [196, 123, 47],
    [197, 130, 49],
    [198, 138, 53],
    [190, 137, 53],
    [191, 145, 54],
    [192, 152, 60],
    [186, 160, 61],
    [186, 160, 61],
    [187, 167, 67],
    [187, 167, 67],
    [189, 175, 73],
    [182, 175, 72],
    [183, 182, 74],
    [183, 182, 79],
    [207, 206, 124],
    [223, 223, 166],
    [239, 239, 203],
    [255, 255, 255]
]
