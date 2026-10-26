export function Lerp(a, b, t) {
    return a + (b - a) * t;
}


export function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}


export function RandomRange(min, max) {
    return Math.random() * (max - min) + min;
}


export function Remap(value, input_range_start, input_range_end, output_range_start, output_range_end) {
    return (value - input_range_start) / (input_range_end - input_range_start) * (output_range_end - output_range_start) + output_range_start;
}


export function Wrap(value, min, max) {
    const range = max - min;
    while (value < min) {
        value += range;
    }
    while (value > max) {
        value -= range;
    }
    return value;
}
