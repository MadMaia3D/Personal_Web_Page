export const KeyState = Object.freeze({
    RELEASED: 0,
    JUST_PRESSED: 1,
    PRESSED: 2,
    JUST_RELEASED: 3
});


export let keyboard = {
    space: KeyState.RELEASED,
    space_pressed: false,
    shift: KeyState.RELEASED,
    shift_pressed: false,
    w: KeyState.RELEASED,
    w_pressed: false,
    a: KeyState.RELEASED,
    a_pressed: false,
    s: KeyState.RELEASED,
    s_pressed: false,
    d: KeyState.RELEASED,
    d_pressed: false,
    q: KeyState.RELEASED,
    q_pressed: false,
    e: KeyState.RELEASED,
    e_pressed: false,
    r: KeyState.RELEASED,
    r_pressed: false,
    c: KeyState.RELEASED,
    c_pressed: false,
    p: KeyState.RELEASED,
    p_pressed: false,
    up: KeyState.RELEASED,
    up_pressed: false,
    left: KeyState.RELEASED,
    left_pressed: false,
    down: KeyState.RELEASED,
    down_pressed: false,
    right: KeyState.RELEASED,
    right_pressed: false,
};


function GetUpdatedKey(key, current_state) {
    if (current_state) {
        switch (key) {
            case KeyState.RELEASED:
                return KeyState.JUST_PRESSED;
            case KeyState.JUST_PRESSED:
                return KeyState.PRESSED;
            case KeyState.PRESSED:
                return KeyState.PRESSED;
            case KeyState.JUST_RELEASED:
                return KeyState.JUST_PRESSED;
        }
    } else {
        switch (key) {
            case KeyState.RELEASED:
                return KeyState.RELEASED;
            case KeyState.JUST_PRESSED:
                return KeyState.JUST_RELEASED;
            case KeyState.PRESSED:
                return KeyState.JUST_RELEASED;
            case KeyState.JUST_RELEASED:
                return KeyState.RELEASED;
        }
    }
}


export function Update(keyboard) {
    keyboard.space = GetUpdatedKey(keyboard.space, keyboard.space_pressed);
    keyboard.shift = GetUpdatedKey(keyboard.shift, keyboard.shift_pressed);
    keyboard.w = GetUpdatedKey(keyboard.w, keyboard.w_pressed);
    keyboard.a = GetUpdatedKey(keyboard.a, keyboard.a_pressed);
    keyboard.s = GetUpdatedKey(keyboard.s, keyboard.s_pressed);
    keyboard.d = GetUpdatedKey(keyboard.d, keyboard.d_pressed);
    keyboard.q = GetUpdatedKey(keyboard.q, keyboard.q_pressed);
    keyboard.e = GetUpdatedKey(keyboard.e, keyboard.e_pressed);
    keyboard.r = GetUpdatedKey(keyboard.r, keyboard.r_pressed);
    keyboard.c = GetUpdatedKey(keyboard.c, keyboard.c_pressed);
    keyboard.p = GetUpdatedKey(keyboard.p, keyboard.p_pressed);
    keyboard.up = GetUpdatedKey(keyboard.up, keyboard.up_pressed);
    keyboard.left = GetUpdatedKey(keyboard.left, keyboard.left_pressed);
    keyboard.down = GetUpdatedKey(keyboard.down, keyboard.down_pressed);
    keyboard.right = GetUpdatedKey(keyboard.right, keyboard.right_pressed);
}


function KeyboardChangePressedValue(key_code, new_value) {
    switch (key_code) {
        case "Space":
            keyboard.space_pressed = new_value;
            break;
        case "ShiftLeft":
            keyboard.shift_pressed = new_value;
            break;
        case "KeyW":
            keyboard.w_pressed = new_value;
            break;
        case "KeyA":
            keyboard.a_pressed = new_value;
            break;
        case "KeyS":
            keyboard.s_pressed = new_value;
            break;
        case "KeyD":
            keyboard.d_pressed = new_value;
            break;
        case "KeyQ":
            keyboard.q_pressed = new_value;
            break;
        case "KeyE":
            keyboard.e_pressed = new_value;
            break;
        case "KeyR":
            keyboard.r_pressed = new_value;
            break;
        case "KeyC":
            keyboard.c_pressed = new_value;
            break;
        case "KeyP":
            keyboard.p_pressed = new_value;
            break;
        case "ArrowUp":
            keyboard.up_pressed = new_value;
            break;
        case "KeyLeft":
            keyboard.left_pressed = new_value;
            break;
        case "ArrowDown":
            keyboard.down_pressed = new_value;
            break;
        case "KeyRight":
            keyboard.right_pressed = new_value;
            break;
    }
}


window.addEventListener("keydown", function (event) {
    if (event.repeat) { return; }
    KeyboardChangePressedValue(event.code, true);
})

window.addEventListener("keyup", function (event) {
    KeyboardChangePressedValue(event.code, false);
})
