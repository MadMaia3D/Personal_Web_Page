export const ButtonState = Object.freeze({
    RELEASED: 0,
    JUST_PRESSED: 1,
    PRESSED: 2,
    JUST_RELEASED: 3
});

export let mouse = {
    x: 0,
    y: 0,
    previous_x: 0,
    previous_y: 0,
    screen_x: 0,
    screen_y: 0,
    left: ButtonState.RELEASED,
    right: ButtonState.RELEASED,
    is_left_down: false,
    is_right_down: false
};


function GetUpdatedButton(button, current_state) {
    if (current_state) {
        switch (button) {
            case ButtonState.RELEASED:
                return ButtonState.JUST_PRESSED;
            case ButtonState.JUST_PRESSED:
                return ButtonState.PRESSED;
            case ButtonState.PRESSED:
                return ButtonState.PRESSED;
            case ButtonState.JUST_RELEASED:
                return ButtonState.JUST_PRESSED;
        }
    } else {
        switch (button) {
            case ButtonState.RELEASED:
                return ButtonState.RELEASED;
            case ButtonState.JUST_PRESSED:
                return ButtonState.JUST_RELEASED;
            case ButtonState.PRESSED:
                return ButtonState.JUST_RELEASED;
            case ButtonState.JUST_RELEASED:
                return ButtonState.RELEASED;
        }
    }
}


export function Update(mouse) {
    mouse.left = GetUpdatedButton(mouse.left, mouse.is_left_down);
    mouse.right = GetUpdatedButton(mouse.right, mouse.is_right_down);
}


export function WindowSpaceToCanvasSpace(mouse, canvas) {
    const rect = canvas.getBoundingClientRect();
    const new_x = mouse.screen_x - rect.left;
    const new_y = mouse.screen_y - rect.top;
    mouse.previous_x = mouse.x;
    mouse.previous_y = mouse.y;
    mouse.x = new_x;
    mouse.y = new_y;
}


export function RegisterMouseEventsToHtmlElement(html_element) {
    html_element.addEventListener("mousemove", OnMouseMove);
    html_element.addEventListener("pointerdown", OnMousePressed);
    html_element.addEventListener("pointerup", OnMouseReleased);
}

function OnMouseMove(event) {
    mouse.screen_x = event.x;
    mouse.screen_y = event.y;
};


function OnMousePressed(event) {
    switch (event.button) {
        case 0:
            mouse.is_left_down = true;
            break;
        case 1:
            break;
        case 2:
            mouse.is_right_down = true;
            break;
    }
}

function OnMouseReleased(event) {
    switch (event.button) {
        case 0:
            mouse.is_left_down = false;
            break;
        case 1:
            break;
        case 2:
            mouse.is_right_down = false;
            break;
    }
}
