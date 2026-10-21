export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    Add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    Sub(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    Mult(factor) {
        this.x *= factor;
        this.y *= factor;
        return this;
    }
    Div(factor) {
        if (factor === 0) {
            return this;
        }
        this.x /= factor;
        this.y /= factor;
        return this;
    }
    GetLengthSquared() { 
        return this.x * this.x + this.y * this.y;
    }
    GetLength() { 
        return Math.sqrt(this.GetLengthSquared());
    }
    Normalize() {
        let length = this.GetLength();
        if (length === 0) {
            return this;
        }
        
        this.x /= length;
        this.y /= length;
        return this;
    }
}


export function GetNormalized(source) {
    let copy = new Vector2(source.x, source.y);
    return copy.Normalize();
}

export function Add(vec1, vec2) {
    let copy = new Vector2(vec1.x, vec1.y);
    return copy.Add(vec2);
}

export function Sub(vec1, vec2) {
    let copy = new Vector2(vec1.x, vec1.y);
    return copy.Sub(vec2);
}

export function Mult(vec, factor) {
    let copy = new Vector2(vec.x, vec.y);
    return copy.Mult(factor);
}

export function Div(vec, factor) {
    let copy = new Vector2(vec.x, vec.y);
    return copy.Div(factor);
}
