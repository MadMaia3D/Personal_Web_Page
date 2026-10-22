import { canvas, context } from "./canvas.js"
import * as Grid from "./grid_base.js";
import * as Timer from "./timer.js";

import * as Mouse from "./mouse.js";
import { mouse } from "./mouse.js";

import * as Keyboard from "./keyboard.js";
import { keyboard } from "./keyboard.js";


const grid = Grid.Create(400, 150, 800, 600, 80, 60);
Grid.Randomize(grid);
const timer = Timer.Create(100);


function Update(delta_time) {
    const result = Timer.Update(timer, delta_time);
    if (result) {
        Grid.UpdateGameOfLife(grid);
    }
    if (keyboard.c === Keyboard.KeyState.JUST_PRESSED) {
        Grid.Clear(grid);
    } else if (keyboard.r === Keyboard.KeyState.JUST_PRESSED) {
        Grid.Randomize(grid);
    } else if (keyboard.p === Keyboard.KeyState.JUST_PRESSED) {
        timer.enabled = !timer.enabled;
    }
    
    if (mouse.is_left_down) {
        let cell_pos = Grid.WorldSpaceToCellSpace(grid, mouse.x, mouse.y);
        Grid.TurnOnCell(grid, cell_pos.x, cell_pos.y);
    } else if (mouse.is_right_down) {
        let cell_pos = Grid.WorldSpaceToCellSpace(grid, mouse.x, mouse.y);
        Grid.TurnOffCell(grid, cell_pos.x, cell_pos.y);
    }
}


function Render() {
    
    Grid.Draw(context, grid);
}


let last_timestamp = 0;

function GameLoop(timestamp) {
    let delta_time = timestamp - last_timestamp;
    last_timestamp = timestamp;
    
    context.clearRect(0, 0, canvas.width, canvas.height);

    Mouse.Update(mouse);
    Keyboard.Update(keyboard);
    Update(delta_time);
    Render();

    requestAnimationFrame(GameLoop);
}


function StartLoop() {
    requestAnimationFrame(GameLoop);
}


StartLoop();
