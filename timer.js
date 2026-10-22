export function Create(max_time_millis) {
    let Timer = {
        limit_millis: max_time_millis,
        current_millis: 0,
        enabled: true
    }
    return Timer;
}


export function Update(timer, delta_time) {
    if (!timer.enabled) {
        return false;
    }
    
    timer.current_millis += delta_time;
    if (timer.current_millis >= timer.limit_millis) {
        timer.current_millis -= timer.limit_millis;
        return true;
    }
    return false;
}
