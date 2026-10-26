import { Create, IsWorldPositionInside, WorldSpaceToCellSpace, Fill, Clear } from "../../shared/grid_base.js"
export { Create, IsWorldPositionInside, WorldSpaceToCellSpace, Fill, Clear };


export function Draw(context, grid) {
    context.strokeStyle = '#88888811';

    const column_width = grid.width / grid.columns;
    const row_height = grid.height / grid.rows;

    for (let row = 0; row < grid.rows; row++) {
        for (let column = 0; column < grid.columns; column++) {
            let cell_x = grid.x + column * column_width;
            let cell_y = grid.y + row * row_height;

            let cell_value = grid.data[column + row * grid.columns];
            context.fillStyle = cell_value ? "#eee" : "#111";
            context.fillRect(cell_x, cell_y, column_width, row_height);
            context.strokeRect(cell_x, cell_y, column_width, row_height);
        }
    }
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


export function CountNeighboors(grid, cell_x, cell_y) {
    let count = 0;

    let left = Math.max(cell_x - 1, 0);
    let right = Math.min(cell_x + 1, grid.columns - 1);
    let top = Math.max(cell_y - 1, 0);
    let bottom = Math.min(cell_y + 1, grid.rows - 1);

    for (let cy = top; cy <= bottom; cy++) {
        for (let cx = left; cx <= right; cx++) {
            count += grid.data[cx + cy * grid.columns];
        }
    }
    // The center cell should be counted as neighboor of itself
    count -= grid.data[cell_x + cell_y * grid.columns]

    return count;
}

export function UpdateGameOfLife(grid) {
    let next_gen = new Array(grid.width, grid.height).fill(0)
    
    for (let cy = 0; cy < grid.rows; cy++) {
        for (let cx = 0; cx < grid.columns; cx++) {
            let neighboors = CountNeighboors(grid, cx, cy);
            switch (neighboors) {
                case 2:
                    next_gen[cx + cy * grid.columns] = grid.data[cx + cy * grid.columns];
                    break;
                case 3:
                    next_gen[cx + cy * grid.columns] = 1;
                    break;
                default:
                    next_gen[cx + cy * grid.columns] = 0;
                    break;
            }
        }
    }
    grid.data = next_gen;
}
