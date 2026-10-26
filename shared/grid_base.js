import { Vector2 } from "../../shared/vector2.js"
import { Clamp } from "../../shared/utility.js"

export function Create(x, y, width, height, n_columns, n_rows) {
    let grid_board = {
        x: x,
        y: y,
        width: width,
        height: height,
        columns: n_columns,
        rows: n_rows,
        data: new Array(n_columns * n_rows).fill(0)
    }
    return grid_board;
}


export function IsWorldPositionInside(grid, x, y) {
    let left_border = grid.x;
    let right_border = grid.x + grid.width;
    let top_border = grid.y;
    let bottom_border = grid.y + grid.height;
    return left_border <= x && x < right_border && top_border <= y && y < bottom_border;
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


export function Fill(grid, value) {
    for (let i = 0; i < grid.rows * grid.columns; i++) {
        grid.data[i] = value;
    }
}

export function Clear(grid) {
    Fill(grid, 0);
}
