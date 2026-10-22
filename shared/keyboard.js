export const KeyState = Object.freeze({
    RELEASED: 0,
    JUST_PRESSED: 1,
    PRESSED: 2,
    JUST_RELEASED: 3
});


const key_codes = {
    space: "Space",
    shift: "ShiftLeft",
    w: "KeyW",
    a: "KeyA",
    s: "KeyS",
    d: "KeyD",
    q: "KeyQ",
    e: "KeyE",
    r: "KeyR",
    c: "KeyC",
    p: "KeyP",
    up: "ArrowUp",
    left: "ArrowLeft",
    down: "ArrowDown",
    right: "ArrowRight"
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


export const keyboard = {};
const pressed_keys = {};

for (const name in key_codes) {
    keyboard[name] = KeyState.RELEASED;
}


export function Update(keyboard) {
    for (const name in key_codes) {
        keyboard[name] = GetUpdatedKey(keyboard[name], pressed_keys[key_codes[name]])
    };
}


export function RegisterKeyboardEventsToHtmlElement(html_element) {
    html_element.addEventListener("keydown", OnKeyDown);
    html_element.addEventListener("keyup", OnKeyUp);
}


function OnKeyDown (event) {
    if (event.repeat) { return; }
    pressed_keys[event.code] = true;
}

function OnKeyUp (event) {
    pressed_keys[event.code] = false;
}
