import { canvas, context, SetCanvasSize } from "../../canvas.js"

import * as Mouse from "../../shared/mouse.js";
import { mouse } from "../../shared/mouse.js";

import * as Keyboard from "../../shared/keyboard.js";
import { keyboard } from "../../shared/keyboard.js";

import * as Grid from "./grid_base.js";
import * as Timer from "../../shared/timer.js";


SetCanvasSize(canvas, 900, 700);
Mouse.RegisterMouseEventsToHtmlElement(canvas);
Keyboard.RegisterKeyboardEventsToHtmlElement(window)

const timer = Timer.Create(100);
timer.enabled = false;

const grid = Grid.Create(50, 50, 800, 600, 80, 60);
Grid.Clear(grid);


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
    
    let is_inside_grid = Grid.IsWorldPositionInside(grid, mouse.x, mouse.y)
    if (mouse.is_left_down && is_inside_grid) {
        let cell_pos = Grid.WorldSpaceToCellSpace(grid, mouse.x, mouse.y);
        Grid.TurnOnCell(grid, cell_pos.x, cell_pos.y);
    } else if (mouse.is_right_down && is_inside_grid) {
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
    Mouse.WindowSpaceToCanvasSpace(mouse, canvas)
    Keyboard.Update(keyboard);
    Update(delta_time);
    Render();

    requestAnimationFrame(GameLoop);
}


function StartLoop() {
    requestAnimationFrame(GameLoop);
}


StartLoop();
