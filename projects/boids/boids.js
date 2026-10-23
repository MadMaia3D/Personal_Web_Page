import { canvas, context, SetCanvasSize } from "../../shared/canvas.js"

import * as Mouse from "../../shared/mouse.js";
import { mouse } from "../../shared/mouse.js";
import * as Keyboard from "../../shared/keyboard.js";
import { keyboard } from "../../shared/keyboard.js";

import { RandomRange } from "../../shared/utility.js";
import { Vector2 as Vec2 } from "../../shared/vector2.js";

import * as Agent from "./agent.js"


SetCanvasSize(canvas, 900, 700);
Mouse.RegisterMouseEventsToHtmlElement(window);
Keyboard.RegisterKeyboardEventsToHtmlElement(window)

const agents = new Array(100);

const mouse_vector = new Vec2(0, 0);
const avoid_cursor_distance = 75;
const seek_cursor_distance = 125;
let is_mouse_inside_canvas = false;


for (let i = 0; i < agents.length; i++) {
    const x = RandomRange(0, canvas.width);
    const y = RandomRange(0, canvas.height);
    const v = RandomRange(50, 500);
    const agent = Agent.Create(x, y, v, 0, 15, 20);
    agent.velocity.Rotate(RandomRange(0, Math.PI * 2));
    agents[i] = agent;
}


function Update(delta_time) {
    mouse_vector.Set(mouse.x, mouse.y);
    is_mouse_inside_canvas =
        0 <= mouse.x && mouse.x < canvas.width &&
        0 <= mouse.y && mouse.y < canvas.height;


    for (let i = 0; i < agents.length; i++) {
        const align_force = Agent.Align(agents[i], agents);
        const cohesion_force = Agent.Cohesion(agents[i], agents);
        const separate_force = Agent.Separate(agents[i], agents).Mult(2);
        Agent.ApplyForce(agents[i], separate_force);
        Agent.ApplyForce(agents[i], align_force);
        Agent.ApplyForce(agents[i], cohesion_force);

        if (is_mouse_inside_canvas && mouse.left) {
            const seek_force = Agent.SeekNearby(agents[i], mouse_vector, seek_cursor_distance);
            Agent.ApplyForce(agents[i], seek_force);
        } else if (is_mouse_inside_canvas) {
            const avoid_force = Agent.Avoid(agents[i], mouse_vector, avoid_cursor_distance);
            Agent.ApplyForce(agents[i], avoid_force);
        }

        Agent.Update(agents[i], delta_time);
        Agent.WrapAroundCanvas(agents[i], canvas);
    }
}


function Render() {
    const cursor_display_radius = mouse.left ? seek_cursor_distance : avoid_cursor_distance;
    context.fillStyle = mouse.left? "#8002" : "#6682";
    context.strokeStyle = context.fillStyle;
    
    if (is_mouse_inside_canvas) {
        context.beginPath();
        context.arc(mouse.x, mouse.y, cursor_display_radius, 0, Math.PI * 2);
        context.stroke();
        context.fill();
    }

    for (let i = 0; i < agents.length; i++) {
        Agent.DrawShadow(agents[i], context);
    }
    for (let i = 0; i < agents.length; i++) {
        Agent.Draw(agents[i], context);
    }
}


let last_timestamp = 0;

function GameLoop(timestamp) {
    let delta_time = (timestamp - last_timestamp) / 1000;
    delta_time = Math.min(delta_time, 0.033);
    last_timestamp = timestamp;

    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#aaa";
    context.fillRect(0, 0, 900, 700);

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
