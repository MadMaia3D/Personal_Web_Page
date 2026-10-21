import { Vector2 } from "./vector2.js"


export function Create(x, y, width, height, n_columns, n_rows) {
    let Grid = {
        x: x,
        y: y,
        width: width,
        height: height,
        columns: n_columns,
        rows: n_rows,
        data: new Array(width, height).fill(0)
    }
    return Grid;
}


export function Draw(context, grid) {
    context.strokeStyle = '#88888844';

    const column_width = grid.width / grid.columns;
    const row_height = grid.height / grid.rows;

    for (let row = 0; row < grid.rows; row++) {
        for (let column = 0; column < grid.columns; column++) {
            let cell_x = grid.x + column * column_width;
            let cell_y = grid.y + row * row_height;

            let cell_value = grid.data[column + row * grid.columns];
            if (!cell_value) {
                context.fillRect(cell_x, cell_y, column_width, row_height);
            }
            context.strokeRect(cell_x, cell_y, column_width, row_height);
        }
    }
}

export function IsWorldPositionInside(grid, x, y) {
    let left_border = grid.x;
    let right_border = grid.x + grid.width;
    let top_border = grid.y;
    let bottom_border = grid.y + grid.height;
    return left_border <= x && x < right_border && top_border <= y && y < bottom_border;
}

function Clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function WorldSpaceToCellSpace(grid, x, y) {
    const column_width = grid.width / grid.columns;
    const row_height = grid.height / grid.rows;

    x = Clamp(x, grid.x, grid.x + grid.width - 0.01);
    y = Clamp(y, grid.y, grid.y + grid.height - 0.01);

    x -= grid.x;
    y -= grid.y;
    x /= column_width;
    y /= row_height;
    x = Math.floor(x);
    y = Math.floor(y);

    return new Vector2(x, y);
}

export function ToogleCell(grid, x, y) {
    grid.data[x + y * grid.columns] = grid.data[x + y * grid.columns] ? 0 : 1;
}

export function TurnOnCell(grid, x, y) {
    grid.data[x + y * grid.columns] = 1;
}

export function TurnOffCell(grid, x, y) {
    grid.data[x + y * grid.columns] = 0;
}

export function Randomize(grid) {
    for (let i = 0; i < grid.rows * grid.columns; i++) {
            grid.data[i] = Math.floor(Math.random() * 2);
    }
}

export function Clear(grid) {
    for (let i = 0; i < grid.rows * grid.columns; i++) {
            grid.data[i] = Math.floor(Math.random() * 2);
    }
}
