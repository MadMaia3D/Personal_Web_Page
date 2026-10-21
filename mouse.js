export const ButtonState = Object.freeze({
    RELEASED: 0,
    JUST_PRESSED: 1,
    PRESSED: 2,
    JUST_RELEASED: 3
});

export let mouse = {
    x: 0,
    y: 0,
    left: ButtonState.RELEASED,
    right: ButtonState.RELEASED,
    is_left_down: false,
    is_right_down: false
};


function GetUpdatedKey(key, current_state) {
    if (current_state) {
        switch (key) {
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
        switch (key) {
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


export function UpdateMouse(mouse) {
    mouse.left = GetUpdatedKey(mouse.left, mouse.is_left_down);
    mouse.right = GetUpdatedKey(mouse.left, mouse.is_right_down);
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});


window.addEventListener("pointerdown", function (event) {
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
})

window.addEventListener("pointerup", function (event) {
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
})
