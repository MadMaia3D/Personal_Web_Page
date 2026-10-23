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
    Rotate(radians) {
        const sin = Math.sin(radians);
        const cos = Math.cos(radians);
        const new_x = cos * this.x - sin * this.y;
        this.y = sin * this.x + cos * this.y;
        this.x = new_x;
        return this;
    }
    Set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    SetLength(new_length) {
        if (this.GetLengthSquared() > 0) {
            this.Normalize();
            this.Mult(new_length);
        }
        return this;
    }
    Limit(max_length) {
        if (this.GetLengthSquared() > max_length * max_length) {
            this.SetLength(max_length)
        }
        return this;
    }
    Copy() {
        return new Vector2(this.x, this.y);
    }
}


export function Add(vec1, vec2) {
    const copy = new Vector2(vec1.x, vec1.y);
    return copy.Add(vec2);
}

export function Sub(vec1, vec2) {
    const copy = new Vector2(vec1.x, vec1.y);
    return copy.Sub(vec2);
}

export function Mult(vec, factor) {
    const copy = new Vector2(vec.x, vec.y);
    return copy.Mult(factor);
}

export function Div(vec, factor) {
    const copy = new Vector2(vec.x, vec.y);
    return copy.Div(factor);
}

export function GetNormalized(source) {
    const copy = new Vector2(source.x, source.y);
    return copy.Normalize();
}

export function GetRotated(source, radians) {
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    const new_x = cos * source.x - sin * source.y;
    const new_y = sin * source.x + cos * source.y;
    return new Vector2(new_x, new_y);
}

export function GetDistanceSquared(v1, v2) {
    return Sub(v2, v1).GetLengthSquared();
}

export function GetDistance(v1, v2) {
    return Math.sqrt(GetDistanceSquared(v1, v2));
}
